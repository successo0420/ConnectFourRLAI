import numpy as np
import matplotlib.pyplot as plt
from tqdm import tqdm
import json
from ConnectFourEnv import ConnectFourEnv
from DqnAgent import DQNAgent

def play_episode(env, agent1, agent2, training=True):
    """
    Play one episode of Connect Four.
    
    Args:
        env: ConnectFourEnv instance
        agent1: DQNAgent for player 1
        agent2: DQNAgent for player 2 (can be None for self-play)
        training: Whether to train the agents
    
    Returns:
        winner: 1, 2, or 0 (draw)
        episode_data: List of (state, action, reward, next_state, done) tuples for agent1
    """
    state = env.reset()
    done = False
    episode_data = []
    
    while not done:
        current_agent = agent1 if env.current_player == 1 else agent2
        
        # Get valid moves
        valid_moves = env.get_valid_moves()
        
        if len(valid_moves) == 0:
            # No valid moves - shouldn't happen but handle it
            break
        
        # Get state representation
        state_rep = env.get_state_representation()
        
        # Select action
        action = current_agent.select_action(state_rep, valid_moves, training=training)
        
        # Take action
        next_state, reward, done, info = env.make_move(action)
        next_state_rep = env.get_state_representation()
        
        # Store transition for the agent that just moved
        if env.current_player == 2:  # Player 1 just moved
            episode_data.append((state_rep, action, reward, next_state_rep, done))
        elif agent2 is agent1:  # Self-play: also store for player 2
            # Flip the board perspective for player 2
            flipped_state = state_rep[[1, 0, 2]]  # Swap player channels
            flipped_next_state = next_state_rep[[1, 0, 2]]
            episode_data.append((flipped_state, action, reward, flipped_next_state, done))
        
        state = next_state
    
    # Determine winner
    if 'winner' in info:
        winner = info['winner']
    else:
        winner = 0  # Draw
    
    # Assign final rewards
    for i in range(len(episode_data)):
        s, a, r, ns, d = episode_data[i]
        if d:  # Game ended
            if winner == 1:
                r = 1.0 if i % 2 == 0 else -1.0  # Win/loss for respective player
            elif winner == 2:
                r = -1.0 if i % 2 == 0 else 1.0
            else:
                r = 0.0  # Draw
            episode_data[i] = (s, a, r, ns, d)
    
    return winner, episode_data


def train_agent(
    num_episodes=10000,
    self_play=True,
    save_interval=500,
    eval_interval=100,
    model_path='connect_four_model.pth'
):
    """
    Train a DQN agent to play Connect Four.
    
    Args:
        num_episodes: Number of training episodes
        self_play: Whether to train against itself (True) or random opponent (False)
        save_interval: Save model every N episodes
        eval_interval: Evaluate every N episodes
        model_path: Path to save the model
    """
    env = ConnectFourEnv()
    agent = DQNAgent()
    
    # For self-play, use the same agent for both players
    agent2 = agent if self_play else None
    
    # Tracking metrics
    wins = []
    losses = []
    draws = []
    episode_rewards = []
    training_losses = []
    
    print(f"Starting training for {num_episodes} episodes...")
    print(f"Self-play: {self_play}")
    
    for episode in tqdm(range(num_episodes)):
        # Play episode
        winner, episode_data = play_episode(env, agent, agent2, training=True)
        
        # Store all transitions
        total_reward = 0
        for transition in episode_data:
            agent.store_transition(*transition)
            total_reward += transition[2]
        
        # Train the agent
        loss = agent.train_step()
        training_losses.append(loss)
        
        # Decay epsilon
        agent.update_epsilon()
        
        # Track results
        episode_rewards.append(total_reward)
        if winner == 1:
            wins.append(1)
        elif winner == 2:
            losses.append(1)
        else:
            draws.append(1)
        
        # Periodic evaluation
        if (episode + 1) % eval_interval == 0:
            win_rate = len(wins) / eval_interval if wins else 0
            avg_reward = np.mean(episode_rewards[-eval_interval:])
            avg_loss = np.mean(training_losses[-eval_interval:]) if training_losses else 0
            
            print(f"\nEpisode {episode + 1}/{num_episodes}")
            print(f"  Win Rate: {win_rate:.2%}")
            print(f"  Avg Reward: {avg_reward:.3f}")
            print(f"  Avg Loss: {avg_loss:.4f}")
            print(f"  Epsilon: {agent.epsilon:.4f}")
            
            # Reset counters
            wins.clear()
            losses.clear()
            draws.clear()
        
        # Save model periodically
        if (episode + 1) % save_interval == 0:
            agent.save(f"{model_path.replace('.pth', '')}_{episode+1}.pth")
    
    # Save final model
    agent.save(model_path)
    
    # Plot training progress
    plot_training_progress(episode_rewards, training_losses)
    
    return agent


def plot_training_progress(episode_rewards, training_losses, window=100):
    """Plot training metrics."""
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
    
    # Plot rewards
    ax1.plot(episode_rewards, alpha=0.3, label='Episode Reward')
    if len(episode_rewards) >= window:
        moving_avg = np.convolve(episode_rewards, np.ones(window)/window, mode='valid')
        ax1.plot(range(window-1, len(episode_rewards)), moving_avg, 
                label=f'{window}-Episode Moving Average', linewidth=2)
    ax1.set_xlabel('Episode')
    ax1.set_ylabel('Total Reward')
    ax1.set_title('Training Rewards')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Plot losses
    if training_losses:
        ax2.plot(training_losses, alpha=0.3, label='Training Loss')
        if len(training_losses) >= window:
            moving_avg = np.convolve(training_losses, np.ones(window)/window, mode='valid')
            ax2.plot(range(window-1, len(training_losses)), moving_avg,
                    label=f'{window}-Episode Moving Average', linewidth=2)
    ax2.set_xlabel('Episode')
    ax2.set_ylabel('Loss')
    ax2.set_title('Training Loss')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('training_progress.png', dpi=150)
    print("Training progress plot saved to training_progress.png")


def evaluate_agent(agent, num_games=100, opponent='random'):
    """
    Evaluate the trained agent.
    
    Args:
        agent: Trained DQNAgent
        num_games: Number of games to play
        opponent: 'random' or 'self'
    """
    env = ConnectFourEnv()
    wins = 0
    losses = 0
    draws = 0
    
    print(f"\nEvaluating agent over {num_games} games against {opponent} opponent...")
    
    for _ in tqdm(range(num_games)):
        state = env.reset()
        done = False
        
        while not done:
            valid_moves = env.get_valid_moves()
            
            if env.current_player == 1:
                # Agent's turn
                state_rep = env.get_state_representation()
                action = agent.select_action(state_rep, valid_moves, training=False)
            else:
                # Opponent's turn
                if opponent == 'random':
                    action = np.random.choice(valid_moves)
                else:  # self
                    state_rep = env.get_state_representation()
                    action = agent.select_action(state_rep, valid_moves, training=False)
            
            state, reward, done, info = env.make_move(action)
        
        if 'winner' in info:
            if info['winner'] == 1:
                wins += 1
            else:
                losses += 1
        else:
            draws += 1
    
    print(f"\nEvaluation Results:")
    print(f"  Wins: {wins} ({wins/num_games:.1%})")
    print(f"  Losses: {losses} ({losses/num_games:.1%})")
    print(f"  Draws: {draws} ({draws/num_games:.1%})")
    
    return wins, losses, draws


if __name__ == '__main__':
    # Train the agent
    agent = train_agent(
        num_episodes=5000,
        self_play=True,
        save_interval=1000,
        eval_interval=100
    )
    
    # Evaluate against random opponent
    evaluate_agent(agent, num_games=100, opponent='random')