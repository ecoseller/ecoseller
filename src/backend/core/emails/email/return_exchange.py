from django.utils.translation import gettext as _
from django.utils import translation

from .base import Email


class EmailReturnFormInformation(Email):
    template_path = "email/generic_email.html"

    def __init__(self, retrun_obj, recipient_list=[], use_rq=False):
        self.retrun_obj = retrun_obj
        self.recipient_list = recipient_list
        self.language = "en"
        self.use_rq = use_rq
        self.meta = {
            "retrun": self.retrun_obj.pk,
            "type": "return_form",
            "language": self.language,
            "recipient_list": self.recipient_list,
        }

    def generate_subject(self):
        translation.activate(self.language)
        self.subject = _("Return request has been received")

    def generate_context(self):
        translation.activate(self.language)
        self.context = {
            "main_title": _("Return request has been received"),
            "subtitle": _("Hello,"),
            "body": _(
                "Your return request has been received. We will contact you shortly with further instructions."
            ),
        }
