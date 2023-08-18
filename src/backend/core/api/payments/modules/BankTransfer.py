from .BasePaymentMethod import PayBySquareMethod
from ..conf import PaymentStatus
import datetime
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
import base64
from io import BytesIO


class BankTransferCZK(PayBySquareMethod):
    def qr_cz(self):
        """
        Generate QR code for Czech bank transfer
        see https://qr-platba.cz/pro-vyvojare/specifikace-formatu/
        """
        code = "".join(
            [
                "SPD*1.0*",
                "ACC:{}+{}".format(self.iban, self.bic),
                "*AM:{}*".format(self.amount),
                "CC:{}".format(self.currency),
                "*X-VS:{}*".format(self.reference),
                "MSG:{}".format(self.note),
                "*DT:{}".format(self.payment_due.strftime("%Y%m%d")),
            ]
        )
        qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H)
        qr.add_data(code)
        img = qr.make_image(
            image_factory=StyledPilImage,
            module_drawer=RoundedModuleDrawer(),
        ).convert("RGB")
        buffered = BytesIO()
        img.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return img_str

    def pay(self):
        self.bic = self.kwargs.get("bic")
        self.iban = self.kwargs.get("iban")
        self.currency = self.kwargs.get("currency")
        self.bank_account = self.kwargs.get("bank_account")
        self.note = self.kwargs.get("note")
        self.payment_due = datetime.datetime.now() + datetime.timedelta(days=7)
        self.reference = 123456789
        self.amount = 100

        return {
            "qr_code": self.qr_cz(),
            "payment_id": self.reference,
            "payment_data": {
                "amount": self.amount,
                "currency": self.currency,
                "reference": self.reference,
                "bank_account": self.bank_account,
                "iban": self.iban,
                "bic": self.bic,
            },
        }

    def status(self) -> PaymentStatus:
        """
        Mock status and return paid with some probability
        """

        return PaymentStatus.PENDING


class BankTransferEUR(BankTransferCZK):
    """
    Bank transfer for EUR
    This class inherits from the CZK version and is left empty, as no changes have been made.
    If you wish to customize the behavior for EUR bank transfers, you can do so based on the CZK version.
    """

    pass
