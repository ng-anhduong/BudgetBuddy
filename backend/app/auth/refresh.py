from flask import jsonify, request, Blueprint
from app.models import User
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

auth_bp = Blueprint('refresh', __name__, url_prefix='/auth')

# route for refreshing jwt token
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh = True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity, fresh=False)
    return jsonify(access_token=access_token)