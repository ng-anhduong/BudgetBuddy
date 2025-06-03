from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, current_user
from app.extension import db, FINANCE_DATA
from app.models import Expenses, ExpenseTypes, CurrencyTypes, MonthlyLimit
from datetime import datetime
from sqlalchemy import update, delete, select
from .calculator import calulate_percentage

auth_bp = Blueprint('monthly_limit_data', __name__, url_prefix='/limits/data')

ALLOWED_CURRENCIES = {c.value for c in CurrencyTypes} # type: ignore

@auth_bp.route('/all', methods=['POST'])
@jwt_required()
def all_monthly_limit():
    query = select(MonthlyLimit).where(MonthlyLimit.user_id==current_user.id) 
    all_limits = db.session.execute(query).scalars().all()
    limit_list = []

    data = request.get_json()
    if data is None or data.get('currency') is None:
        currency = current_user.currency
        if currency is None:
            for element in all_limits:
                types=[val.value for val in element.types]
                temp = calulate_percentage(float(element.amount), element.currency.value, element.types)     # type: ignore
                limit_list.append({
                    'id':           element.id,
                    'amount':       element.amount,
                    'currency':     element.currency.value,  # type: ignore
                    'percentage':   temp.get('percentage'),
                    'total':        temp.get('total'),
                    'types':        types
                })
        else:
            currency = currency.value
            for element in all_limits:
                types=[val.value for val in element.types]
                value = float(element.amount)/FINANCE_DATA['rates'][element.currency.value]* FINANCE_DATA['rates'][currency] # type: ignore
                temp = calulate_percentage(value, currency, element.types)     # type: ignore
                limit_list.append({
                    'id':           element.id,
                    'amount':       round(value,2),
                    'currency':     currency,
                    'percentage':   temp.get('percentage'),
                    'total':        temp.get('total'),
                    'types':        types
                })
    else:
        currency = data.get('currency')
        if currency not in ALLOWED_CURRENCIES:
            return jsonify({ 'message': 'Unknown currency' }), 400
        for element in all_limits:
            types=[val.value for val in element.types]
            value = float(element.amount)/FINANCE_DATA['rates'][element.currency.value]* FINANCE_DATA['rates'][currency] # type: ignore
            temp = calulate_percentage(value, currency, element.types)     # type: ignore
            limit_list.append({
                'id':           element.id,
                'amount':       round(value,2),
                'currency':     currency,
                'percentage':   temp.get('percentage'),
                'total':        temp.get('total'),
                'types':        types
            })
            
    return limit_list

@auth_bp.route('/updating', methods=['POST'])
@jwt_required()
def updating_limit():
    data = request.get_json()
    limit_id = int(data.get('id'))
    query = select(MonthlyLimit).filter_by(id=limit_id)
    lim = db.session.execute(query).scalars().one_or_none()
    if lim is None:
        return jsonify({"message":"Unauthorized"}), 400
    
    return jsonify({                           
            'id':           lim.id,
            'amount':       lim.amount,
            'currency':     lim.currency.value,     #type: ignore
            'types':        lim.types,
        }), 200 