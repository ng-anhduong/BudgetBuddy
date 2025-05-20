from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, current_user

auth_bp = Blueprint('index', __name__, url_prefix='/home_page')

# route to retrieve personal data from db
@auth_bp.route('/index', methods=['POST'])
@jwt_required()
def index():
    return jsonify({
        "username":current_user.username,
    })