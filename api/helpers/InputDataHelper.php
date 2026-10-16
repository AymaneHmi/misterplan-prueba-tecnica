<?php

class InputDataHelper
{

    public function sanitizeInput($data)
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        return $data;
    }

    public function isValidEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public function isValidDate($dateStr, $format = 'Y-m-d')
    {
        $d = DateTime::createFromFormat($format, $dateStr);
        return $d && $d->format($format) === $dateStr;
    }

    public function isDateRangeValid($start_date, $end_date)
    {
        if (
            !self::isValidDate($start_date) ||
            !self::isValidDate($end_date)
        ) {
            return false;
        }

        return $end_date > $start_date;
    }

}
