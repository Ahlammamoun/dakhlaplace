FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    icu-dev \
    libzip-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    $PHPIZE_DEPS \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    && docker-php-ext-install \
        pdo_mysql \
        intl \
        zip \
        gd \
        opcache \
    && apk del $PHPIZE_DEPS

COPY --from=composer:2 \
    /usr/bin/composer \
    /usr/bin/composer

WORKDIR /var/www/backend

COPY composer.json composer.lock symfony.lock ./

RUN composer install \
    --no-interaction \
    --prefer-dist \
    --no-scripts

COPY . .

RUN composer dump-autoload --optimize \
    && mkdir -p var/cache var/log public/uploads \
    && chown -R www-data:www-data var public/uploads

RUN printf '%s\n' \
    'upload_max_filesize=10M' \
    'post_max_size=12M' \
    'memory_limit=256M' \
    > /usr/local/etc/php/conf.d/uploads.ini

CMD ["php-fpm"]
