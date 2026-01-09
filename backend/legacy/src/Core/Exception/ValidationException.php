<?php
namespace App\Core\Exception;

class ValidationException extends ApiException {
    private array $errors;

    public function __construct($errors) {
        parent::__construct("Validation failed", 422);
        $this->errors = $errors;
    }

    public function getErrors() : array {
        return $this->errors;
    }
}
