<?php

namespace App\Controllers;
use App\Controllers\BaseController;

class Utilisateur extends BaseController
{
    public function index()
    {
        helper(['form']);
        $data = [];
        echo view('signup', $data);
    }
    public function login()
    {
        echo 'eee';
    }
}
