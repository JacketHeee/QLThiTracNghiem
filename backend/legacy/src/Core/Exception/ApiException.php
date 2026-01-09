<?php
namespace App\Core\Exception;

use Exception;

class ApiException extends Exception {
    protected int $statusCode;

    public function __construct($message, $statusCode = 400) {
        parent::__construct($message);
        $this->statusCode = $statusCode;
    }

    public function getStatusCode() {
        return $this->statusCode;
    }
}
?>
