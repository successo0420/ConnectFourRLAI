from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import torch
from DqnAgent import DQNAgent

app = Flask(__name__)
CORS(app)

# Initialize the agent
agent = None
MODEL_PATH = 'connect_four_model.pth'

def load_agent():
    """Load the trained agent."""
    global agent
    try:
        agent = DQNAgent()
        agent.load(MODEL_PATH)
        agent.policy_net.eval()  # Set to evaluation mode
        print("✓ RL agent loaded successfully!")
    except FileNotFoundError:
        print("⚠ Model file not found. Agent will use random moves.")
        print("  Run train.py first to train the model.")
        agent = None
    except Exception as e:
        print(f"⚠ Error loading agent: {e}")
        agent = None

# Load agent on startup
load_agent()

def board_to_state_representation(board, current_player=2):
    """
    Convert board from frontend format to neural network input format.
    
    Frontend board: 2D array where 0=empty, 1=player, 2=AI
    Network input: (3, 6, 7) array with channels for [current_player, opponent, empty]
    """
    board_array = np.array(board, dtype=int)
    
    state = np.zeros((3, 6, 7), dtype=np.float32)
    state[0] = (board_array == current_player).astype(np.float32)  # AI pieces
    state[1] = (board_array == (3 - current_player)).astype(np.float32)  # Player pieces
    state[2] = (board_array == 0).astype(np.float32)  # Empty spaces
    
    return state

def get_valid_moves(board):
    """Get list of valid column indices."""
    return [col for col in range(7) if board[0][col] == 0]

@app.route('/get-move', methods=['POST'])
def get_move():
    """
    Get the AI's move for the current board state.
    
    Expected request JSON:
    {
        "board": [[...], [...], ...],  # 6x7 array
        "player": 2  # Current player (optional, defaults to 2 for AI)
    }
    
    Returns:
    {
        "column": int,  # Column to play (0-6)
        "method": "rl" or "random"  # How the move was selected
    }
    """
    try:
        data = request.json
        board = data.get('board')
        current_player = data.get('player', 2)
        
        if not board:
            return jsonify({"error": "No board provided"}), 400
        
        # Get valid moves
        valid_moves = get_valid_moves(board)
        
        if not valid_moves:
            return jsonify({"error": "No valid moves available"}), 400
        
        # Use RL agent if available
        if agent is not None:
            # Convert board to state representation
            state = board_to_state_representation(board, current_player)
            
            # Get move from agent (with training=False for deterministic behavior)
            move = agent.select_action(state, valid_moves, training=False)
            
            return jsonify({
                "column": int(move),
                "method": "rl",
                "epsilon": float(agent.epsilon)
            })
        else:
            # Fallback to random if model not loaded
            import random
            move = random.choice(valid_moves)
            
            return jsonify({
                "column": int(move),
                "method": "random",
                "message": "Model not loaded, using random moves"
            })
    
    except Exception as e:
        print(f"Error in get-move: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/reload-model', methods=['POST'])
def reload_model():
    """Reload the model (useful after training)."""
    try:
        load_agent()
        if agent is not None:
            return jsonify({
                "status": "success",
                "message": "Model reloaded successfully"
            })
        else:
            return jsonify({
                "status": "warning",
                "message": "Model file not found"
            }), 404
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/status', methods=['GET'])
def status():
    """Get the current status of the AI."""
    return jsonify({
        "model_loaded": agent is not None,
        "model_path": MODEL_PATH,
        "epsilon": float(agent.epsilon) if agent else None
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("Connect Four RL Backend")
    print("="*50)
    if agent:
        print("✓ Running with RL agent")
    else:
        print("⚠ Running with random agent (train model first)")
    print("="*50 + "\n")
    
    app.run(port=5000, debug=True)