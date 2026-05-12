# Connect Four RL - Reinforcement Learning Backend

This is the backend for your Connect Four game using Deep Q-Network (DQN) reinforcement learning.

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 2: Train the Model

Run the training script to train your first RL agent:

```bash
python train.py
```

**Training Parameters (in `train.py`):**
- `num_episodes=5000` - Number of games to train (start with 5000, increase to 10000+ for better results)
- `self_play=True` - Agent plays against itself (faster learning)
- `save_interval=1000` - Saves model every 1000 episodes
- `eval_interval=100` - Prints progress every 100 episodes

**Expected Training Time:**
- CPU: ~30-60 minutes for 5000 episodes
- GPU: ~10-20 minutes for 5000 episodes

The training will:
- Save checkpoints as `connect_four_model_1000.pth`, `connect_four_model_2000.pth`, etc.
- Save final model as `connect_four_model.pth`
- Generate `training_progress.png` showing learning curves

### Step 3: Run the Backend

```bash
python app.py
```

The server will start on `http://localhost:5000`


## 📁 File Structure

```
connect-four-rl/
├── app.py                    # Flask backend API
├── train.py                  # Training script
├── dqn_agent.py             # DQN agent implementation
├── connect_four_env.py      # Game environment
├── requirements.txt         # Python dependencies
├── connect_four_model.pth   # Trained model (created after training)
└── training_progress.png    # Training visualization (created after training)
```

## 🧠 How It Works

### 1. Environment (`connect_four_env.py`)
- Implements the Connect Four game logic
- Handles move validation, win detection, and game state
- Converts board to neural network input format (3 channels: player, opponent, empty)

### 2. DQN Agent (`dqn_agent.py`)
- **Neural Network Architecture:**
  - 3 convolutional layers (extract spatial patterns)
  - 3 fully connected layers (decision making)
  - Input: (3, 6, 7) tensor representing board state
  - Output: Q-values for each of 7 possible actions (columns)

- **Key RL Techniques:**
  - **Experience Replay:** Stores past experiences and samples randomly for training
  - **Target Network:** Stable target for Q-value updates
  - **Epsilon-Greedy:** Balances exploration (random moves) and exploitation (best moves)
  - **Reward Shaping:** +1 for win, -1 for loss, 0 for draw

### 3. Training Process (`train.py`)
- **Self-Play:** Agent plays against itself to generate training data
- **Curriculum Learning:** Epsilon decays from 1.0 → 0.01 (more exploitation over time)
- **Evaluation:** Periodically tests against random opponent

## 🎯 Training Tips

### For Better Performance:

1. **Train Longer:**
   ```python
   agent = train_agent(num_episodes=20000)  # More episodes = better agent
   ```

2. **Adjust Hyperparameters in `dqn_agent.py`:**
   ```python
   agent = DQNAgent(
       learning_rate=0.0005,      # Lower = more stable
       gamma=0.99,                # Discount factor for future rewards
       epsilon_decay=0.998,       # Slower decay = more exploration
       batch_size=128,            # Larger = more stable updates
       memory_size=50000          # More experience = better learning
   )
   ```

3. **Use GPU:**
   - Install CUDA-enabled PyTorch
   - Training will automatically use GPU if available

4. **Monitor Training:**
   - Watch the win rate increase over time
   - Check `training_progress.png` for learning curves
   - Good agent should achieve >80% win rate vs random opponent

## 🔧 API Endpoints

### POST `/get-move`
Get AI's next move.

**Request:**
```json
{
  "board": [[0,0,0,0,0,0,0], [0,0,0,0,0,0,0], ...],
  "player": 2
}
```

**Response:**
```json
{
  "column": 3,
  "method": "rl",
  "epsilon": 0.01
}
```

### POST `/reload-model`
Reload the model after training.

### GET `/status`
Check if model is loaded.

## 🐛 Troubleshooting

### Model Not Loading
```
⚠ Model file not found. Agent will use random moves.
```
**Solution:** Run `python train.py` first to create the model.

### CUDA Out of Memory
**Solution:** Reduce `batch_size` in `dqn_agent.py` or train on CPU.

### Poor Performance After Training
**Solutions:**
- Train for more episodes (10000+)
- Check `training_progress.png` - loss should decrease
- Try adjusting learning rate or epsilon decay

## 📚 Learn More

- [Deep Q-Learning Paper](https://arxiv.org/abs/1312.5602)
- [Connect Four Strategy](https://en.wikipedia.org/wiki/Connect_Four)
- [PyTorch Documentation](https://pytorch.org/docs/stable/index.html)

---

**Happy Training! 🎮🤖**