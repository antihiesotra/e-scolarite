<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class Utilisateur extends BaseController
{
    public function index()
    {
        //
    }
    public function login()
    {
        $retour = array();
        $retour['json1'] = array(
            'test 1' => 'valiny 1 ',
            'test 2' => 'valiny 2 ',
        );
        echo $retour;
    }
}
