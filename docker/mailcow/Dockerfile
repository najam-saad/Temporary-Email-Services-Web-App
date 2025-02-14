FROM mailcow/mailcow-dockerized:latest

# Copy configuration
COPY ./mailcow.conf /opt/mailcow-dockerized/mailcow.conf

# Set environment variables
ENV MAILCOW_HOSTNAME=mail.tempfreeemail.com
ENV MAILCOW_TZ=UTC
ENV SKIP_LETS_ENCRYPT=n
ENV SKIP_CLAMD=n
ENV SKIP_SOLR=y
ENV SKIP_SOGO=y
ENV COMPOSE_PROJECT_NAME=mailcow-dockerized

# Expose ports
EXPOSE 25 465 587 143 993 110 995 4190 8080 8443

# Set up the entrypoint
ENTRYPOINT ["/opt/mailcow-dockerized/generate_config.sh"]
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"] 