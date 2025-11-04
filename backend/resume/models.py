# resumes/models.py
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _


User = get_user_model()


class Resume(models.Model):
    """
    Resume model for storing user resumes.
    Scoped to user (no multi-tenant hospital FK needed).
    Content as JSONField for flexible sections (e.g., {'summary': '...', 'experience': [...]}).
    Status: draft | completed.
    Score: AI-generated 0-100.
    """
    STATUS_CHOICES = [
        ('draft', _('Draft')),
        ('completed', _('Completed')),
    ]
    
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='resumes'
    )
    title = models.CharField(_('title'), max_length=255)
    template = models.CharField(_('template'), max_length=100, default='modern')
    content = models.JSONField(_('content'), default=dict)  # e.g., {'sections': {...}}
    score = models.IntegerField(_('AI score'), default=0, help_text='0-100')
    status = models.CharField(_('status'), max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        verbose_name = _('resume')
        verbose_name_plural = _('resumes')
        ordering = ['-updated_at']
        #constraints = [
         #   models.UniqueConstraint(
          #      fields=['user', 'title'], name='unique_user_resume_title'
           # )
        #]

    def __str__(self):
        return f"{self.user.email} - {self.title}"