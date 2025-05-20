from .extension import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Numeric, String, DateTime, Text, ForeignKey
from datetime import datetime
import enum

# name: Mapped[<python type>] = mapped_column(<optional sqlalchemy_type>, <attrs>)

# table to manage accounts
class User(db.Model): 
    id:       Mapped[int] = mapped_column(primary_key = True)
    username: Mapped[str] = mapped_column(String(255), unique = True, nullable = False)
    password: Mapped[str] = mapped_column(String(255), nullable = False)

# custom data tyoe
class TransactionTypes(enum.Enum):
    UTILITIES              = "Utilities"
    SUBSCRIPTIONS          = "Subscriptions"
    RENT                   = "Rent"
    #INSURANCE              = "Insurance"
    EDUCATION              = "Education"
    ENTERTAINMENT          = "Entertainment"
    MAINTENANCE_REPAIRS    = "Maintenance and repairs"
    TRAVEL                 = "Travel"
    MEALS                  = "meals"
    SHOPPING               = "shopping"
    OTHER                  = "other"

class Transactions(db.Model):
    id:            Mapped[int]              = mapped_column(primary_key = True)
    user_id:       Mapped[int]              = mapped_column(ForeignKey("user.id"), nullable = False)
    category:      Mapped[TransactionTypes]
    optional_cat:  Mapped[str]              = mapped_column(String(100))
    amount:        Mapped[float]            = mapped_column(Numeric(10, 2), nullable = False)
    currency:      Mapped[str]              = mapped_column(String(3), nullable=False)
    description:   Mapped[str]              = mapped_column(Text)
    date:          Mapped[datetime]         = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    