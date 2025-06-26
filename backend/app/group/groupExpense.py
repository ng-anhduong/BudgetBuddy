from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, current_user
from app.extension import db
from app.models import Group, CurrencyTypes, GroupExpenseOwe, GroupExpenses, User
from datetime import datetime
from sqlalchemy import update, delete
import string, random

# Create a blueprint
auth_bp = Blueprint('group_expense', __name__, url_prefix='/group/groupExpense')

ALLOWED_CURRENCIES = {c.value for c in CurrencyTypes} # type: ignore

# Route to create new group expense
# Return status only (201, 400, 404)
@auth_bp.route('/add', methods=['POST'])
@jwt_required()
def add_group_expense():
    # @params
    #   group_id: string
    #   amount: float
    #   curency: string(3)
    #   note: string
    #   time: string in isoformat
    #   owes: list[{username(string), amount(float)}]
    data=request.get_json() or {}
    #   payer_id: current user id
    group_id = data.get('group_id')
    amount = data.get('amount')
    currency = data.get('currency')
    note = data.get('note')
    time = data.get('time')
    owes = data.get('owes')

    if not group_id or not amount or not currency or not note or not time or not owes:
        return jsonify({ 'message': 'Missing values' }), 400

    if currency not in ALLOWED_CURRENCIES:
        return jsonify({ 'message': 'Unknown currency' }), 400
    
    currency = CurrencyTypes(currency) # type: ignore

    try:
        time = datetime.fromisoformat(time).date()
    except ValueError:
        return jsonify({'message': 'Invalid time format'}), 400

    group = Group.query.filter_by(group_id = group_id).first()
    if not group:
        return jsonify({'message': 'Group not found'}), 404

    try:
        new_group_expense = GroupExpenses(
            group_id = group.id,            # type: ignore
            payer_id = current_user.id,     # type: ignore
            amount = amount,                # type: ignore
            currency = currency,            # type: ignore
            note = note,                    # type: ignore
            created_at = time,              # type: ignore
        )
        db.session.add(new_group_expense)
        db.session.flush()  # ensure new_group_expense.id is generated

        for element in owes:
            payee_username = element.get('username')
            owe_amount = element.get('amount')

            if payee_username is None or owe_amount is None:
                db.session.rollback()
                return jsonify({'message': 'Invalid owes entry'}), 400
            
            payee = User.query.filter_by(username=payee_username).first()

            if payee is None:
                db.session.rollback()
                return jsonify({'message': 'Invalid owes entry'}), 400
            
            temp = GroupExpenseOwe(
                expense_id = new_group_expense.id,  # type: ignore
                payee_id = payee.id,                # type: ignore
                amount = owe_amount,                # type: ignore
                currency = currency,                # type: ignore
            )
            new_group_expense.owes.append(temp)

        group.history.append(new_group_expense)
        db.session.commit()
        return jsonify({'message': f'Expense added to group {group.name}'}), 201
    except Exception as e:
        print("DB Error:", e)
        db.session.rollback()
        return jsonify({'message': 'Database error'}), 500  

