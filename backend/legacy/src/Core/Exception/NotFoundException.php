<?php
namespace App\Core\Exception;

class NotFoundException extends ApiException {
    public function __construct($message = "NotFound") {
        parent::__construct($message, 404);
    }
}
