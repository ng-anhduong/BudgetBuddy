from app.models import Expenses, ExpenseTypes, CurrencyTypes, MonthlyLimit
from app.extension import FINANCE_DATA, db
from sqlalchemy import update, delete, select, extract
from flask_jwt_extended import current_user
from datetime import date

def calulate_percentage(amount, currency, types):
    current_month = date.today().month
    raw_types = [val for val in types]
    convert = lambda x, y: float(x)/FINANCE_DATA['rates'][y]* FINANCE_DATA['rates'][currency]
    total = float(0)
    query = (select(Expenses)
        .where(Expenses.user_id==current_user.id)
        .where(Expenses.category.in_(raw_types))        # type: ignore
        .where(extract('month', Expenses.time) == current_month))       # type: ignore
    trs = db.session.execute(query).scalars().all()
    
    for trn in trs:
        total += convert(trn.amount, trn.currency.value)    # type: ignore
    
    percentage = round(float(total/amount)* 100, 2)
    total = round(total, 2)
    return {
        'percentage': percentage,
        'total': total
    }

