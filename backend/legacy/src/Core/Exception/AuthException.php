<?php
namespace App\Core\Exception;

class AuthException extends ApiException {
    public function __construct($message = "Unauthorized") {
        parent::__construct($message, 401);
    }
}
