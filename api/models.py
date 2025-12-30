from django.db import models
from api.utils.validators import validate_decimal_precision

# aqui las demas validaciones

class StructureC04(models.Model):
    idType = models.CharField(max_length=1)
    idNumber = models.CharField(max_length=20)
    operationNumber = models.CharField(max_length=50)
    assetCode = models.CharField(max_length=50)
    assetType = models.CharField(max_length=10)
    issuer = models.CharField(max_length=100)
    issueDate = models.DateField()
    maturityDate = models.DateField()
    nominalValue = models.DecimalField(max_digits=15, decimal_places=2, validators=[validate_decimal_precision])
    accountingDate = models.DateField()
    bookValue = models.DecimalField(max_digits=15, decimal_places=2, validators=[validate_decimal_precision])
    lastAppraisalValue = models.DecimalField(max_digits=15, decimal_places=2, validators=[validate_decimal_precision])
    provisionValue = models.DecimalField(max_digits=15, decimal_places=2, validators=[validate_decimal_precision])
    realizationDate = models.DateField(null=True, blank=True)
    realizationValue = models.DecimalField(max_digits=15, decimal_places=2, validators=[validate_decimal_precision])
    recordStatus = models.CharField(max_length=1)

    class Meta:
        db_table = 'c04'

class StructureI01(models.Model):
    instrumentNumber = models.CharField(max_length=50)
    issuerIdType = models.CharField(max_length=1)
    issuerId = models.CharField(max_length=20)
    issueDate = models.DateField()
    purchaseDate = models.DateField()
    instrumentType = models.CharField(max_length=10)
    issuerCountry = models.CharField(max_length=3)
    nominalValueUsd = models.DecimalField(max_digits=15, decimal_places=2, validators=[validate_decimal_precision])
    purchaseValueUsd = models.DecimalField(max_digits=15, decimal_places=2, validators=[validate_decimal_precision])
    couponPaymentPeriodDays = models.IntegerField()
    issuerClassification = models.CharField(max_length=2)
    issuerType = models.CharField(max_length=2)

    class Meta:
        db_table = 'i01'

class StructureI02(models.Model):
    instrumentNumber = models.CharField(max_length=50)
    issuerIdType = models.CharField(max_length=1)
    issuerId = models.CharField(max_length=20)
    issueDate = models.DateField()
    purchaseDate = models.DateField()
    # Copied fields from I01 logic + I02 specific
    maturityDate = models.DateField()
    riskRating = models.CharField(max_length=10)
    ratingAgency = models.CharField(max_length=50)
    lastRatingDate = models.DateField()
    accountCode = models.CharField(max_length=20)
    bookValueUsd = models.DecimalField(max_digits=15, decimal_places=2, validators=[validate_decimal_precision])
    instrumentStatus = models.CharField(max_length=5)
    nominalInterestRate = models.DecimalField(max_digits=5, decimal_places=2, validators=[validate_decimal_precision])
    accruedInterestUsd = models.DecimalField(max_digits=15, decimal_places=2, validators=[validate_decimal_precision])
    regulatoryRiskRating = models.CharField(max_length=5)
    provisionAmountUsd = models.DecimalField(max_digits=15, decimal_places=2, validators=[validate_decimal_precision])

    class Meta:
        db_table = 'i02'
