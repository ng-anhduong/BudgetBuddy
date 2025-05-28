from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, current_user
from app.extension import db
from app.models import ExpenseTypes, CurrencyTypes, MonthlyLimit
from datetime import datetime
from sqlalchemy import update, delete

auth_bp = Blueprint('monthly_limit_action', __name__, url_prefix='/limits/action')

ALLOWED_CURRENCIES = {c.value for c in CurrencyTypes}   # type: ignore
ALLOWED_CATEGORIES = {e.value for e in ExpenseTypes}    # type: ignore

@auth_bp.route('/add', methods=['POST'])
@jwt_required()
def add_limit():  
    data = request.get_json()
    amount = data.get('amount')
    currency = data.get('currency')
    if currency not in ALLOWED_CURRENCIES:
        return jsonify({ 'message': 'Unknown currency' }), 400
    currency = CurrencyTypes(currency) # type: ignore
    types = list(data.get('types'))
    correct_types=[]
    for element in types:
        if element not in ALLOWED_CATEGORIES: 
            return jsonify({ 'message': 'Invalid expense type' }), 400
        correct_types.append(ExpenseTypes(element))    # type: ignore
    
    try:
        new_lim = MonthlyLimit(
            user_id = current_user.id,          # type: ignore
            amount = amount,                    # type: ignore
            currency = currency,                # type: ignore
            types = correct_types,              # type: ignore
        ) 
        db.session.add(new_lim)
        db.session.commit()
        return jsonify({'message': 'Successfully set up a new monthly limit'}), 201

    except Exception as e:
        print("DB Error:", e)
        db.session.rollback()
        return jsonify({'message': 'Database error'}), 500

@auth_bp.route('/update', methods=['POST'])
@jwt_required()
def update_limit():
    data = request.get_json()
    id = data.get('id')
    amount = data.get('amount')
    currency = data.get('currency')
    if currency not in ALLOWED_CURRENCIES:
        return jsonify({ 'message': 'Unknown currency' }), 400
    currency = CurrencyTypes(currency) # type: ignore
    types = list(data.get('types'))
    correct_types=[]
    for element in types:
        if element not in ALLOWED_CATEGORIES: 
            return jsonify({ 'message': 'Invalid expense type' }), 400
        correct_types.append(ExpenseTypes(element))    # type: ignore
    
    try:
        upd: dict={
            'user_id': current_user.id,
            'amount': amount,
            'currency': currency,
            'types': correct_types,
        }
        query = (
            update(MonthlyLimit)
            .where(MonthlyLimit.id == id)
            .where(MonthlyLimit.user_id == current_user.id)
            .values(**upd)
        )
        result = db.session.execute(query)
        if not result:
            return jsonify({ 'message': 'Expense not found or no changes' }), 404

        db.session.commit()
        return jsonify({'message': 'Successfully updated your monthly limit'}), 201
    
    except Exception as e:
        print("DB Error:", e)
        db.session.rollback()
        return jsonify({'message': 'Database error'}), 500    


@auth_bp.route('/delete', methods=['POST'])
@jwt_required()
def delete_limit():
    data = request.get_json()

    id = int(data.get('id'))
    try:
        query = delete(MonthlyLimit).where(MonthlyLimit.id == id)
        db.session.execute(query)
        db.session.commit()
        return jsonify({'message': 'Successfully deleted your monthly limit'}), 201
    except Exception as e:
        print("DB Error:", e)
        db.session.rollback()
        return jsonify({'message': 'Database error'}), 500 