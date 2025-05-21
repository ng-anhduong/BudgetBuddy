from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, current_user
from app.extension import db
from app.models import Transactions, TransactionTypes
from datetime import datetime
from sqlalchemy import update, delete

auth_bp = Blueprint('action', __name__, url_prefix='/home_page/action')

ALLOWED_CATEGORIES = {e.value for e in TransactionTypes}

# route to retrieve personal data from db
@auth_bp.route('/add', methods=['POST'])
@jwt_required()
def addd():
    
    data = request.get_json()

    category = data.get('category')
    if category not in ALLOWED_CATEGORIES:
        return jsonify({ 'message': 'Invalid transaction type' }), 400
    
    category = TransactionTypes(category)

    optional_cat = data.get('optional_cat')
    amount = float(data.get('amount'))
    currency = data.get('currency')
    description = data.get('description')
    date = datetime.fromisoformat(data.get('date'))

    if not category or not amount or not currency or not date:
        return jsonify({ 'message': 'Missing values' }), 400

    try:
        new_trs = Transactions(
            user_id = current_user.id,          # type: ignore
            category = category,                # type: ignore
            optional_cat = optional_cat,        # type: ignore
            amount = amount,                    # type: ignore
            currency = currency,                # type: ignore
            description = description,          # type: ignore
            date = date,                        # type: ignore
        ) 
        db.session.add(new_trs)
        db.session.commit()
        return jsonify({'message': 'Successfully add a new transaction'}), 201

    except Exception as e:
        print("DB Error:", e)
        db.session.rollback()
        return jsonify({'message': 'Database error'}), 500

@auth_bp.route('/update', methods=['POST'])
@jwt_required()
def uupdate():
    data = request.get_json()

    id = data.get('id')
    category = data.get('category')
    if category not in ALLOWED_CATEGORIES:
        return jsonify({ 'message': 'Invalid transaction type' }), 400
    
    category = TransactionTypes(category)

    optional_cat = data.get('optional_cat')
    amount = float(data.get('amount'))
    currency = data.get('currency')
    description = data.get('description')
    date = datetime.fromisoformat(data.get('date'))

    if not category or not amount or not currency or not date:
        return jsonify({ 'message': 'Missing values' }), 400

    try:
        upd: dict = {
            'user_id':          current_user.id, 
            'category':         category,             
            'optional_cat':     optional_cat,      
            'amount':           amount,                
            'currency':         currency,                
            'description':      description,          
            'date':             date,                        
        }
        query = (
            update(Transactions)
            .where(Transactions.id == id)
            .where(Transactions.user_id == current_user.id)
            .values(**upd)
        )
        
        result = db.session.execute(query)
        if not result:
            return jsonify({ 'message': 'Transaction not found or no changes' }), 404

        db.session.commit()
        return jsonify({'message': 'Successfully updated a transaction'}), 201

    except Exception as e:
        print("DB Error:", e)
        db.session.rollback()
        return jsonify({'message': 'Database error'}), 500    


@auth_bp.route('/delete', methods=['POST'])
@jwt_required()
def deletee():
    data = request.get_json()

    id = int(data.get('id'))
    try:
        query = delete(Transactions).where(Transactions.id == id)
        db.session.execute(query)
        db.session.commit()
        return jsonify({'message': 'Successfully deleted a transaction'}), 201
    except Exception as e:
        print("DB Error:", e)
        db.session.rollback()
        return jsonify({'message': 'Database error'}), 500  


