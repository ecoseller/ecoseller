import abc
import django_rq
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings


class Email:
    recipient_list = []
    context = {}
    template_path = ""
    sender = ""
    subject = ""
    language = "cs"
    use_rq = False
    meta = {}

    @abc.abstractmethod
    def generate_context(self):
        """This method should be implemented by the subclasses
        and set self.context that will be then injected into a template
        """
        pass

    @abc.abstractmethod
    def generate_subject(self):
        """This method should be implemented by the subclasses
        and set self.subject
        """
        pass

    def generate_msg_html(self):
        """This method returns html string with template and context"""
        return render_to_string(self.template_path, self.context)

    def render_to_string(self):
        self.generate_context()
        return self.generate_msg_html()

    def send(self):
        """This method returns html string with template and context"""
        self.generate_subject()
        self.generate_context()
        print("sending", self.subject)

        queue = django_rq.get_queue(
            "high", autocommit=True, is_async=True, default_timeout=360
        )

        args = (
            self.subject,
            "",
            settings.EMAIL_FROM,
            self.recipient_list,
        )

        kwargs = {"html_message": self.generate_msg_html()}

        if self.use_rq:
            queue.enqueue(
                send_mail,
                args=args,
                kwargs=kwargs,
                meta=self.meta,
            )
        else:
            send_mail(*args, **kwargs)

    def send_at(self, delay=0):
        """This method returns html string with template and context"""
        self.generate_subject()
        self.generate_context()

        queue = django_rq.get_queue(
            "high", autocommit=True, is_async=True, default_timeout=360
        )

        args = (
            self.subject,
            "",
            settings.EMAIL_FROM,
            self.recipient_list,
        )

        kwargs = {"html_message": self.generate_msg_html()}

        queue.enqueue_in(
            delay,
            send_mail,
            args=args,
            kwargs=kwargs,
            meta=self.meta,
        )
