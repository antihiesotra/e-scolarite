<?php

namespace App\Controllers;
use App\Controllers\BaseController;
//use App\Models\UtilisateurModel;

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
        /*$session = session();
        $userModel = new UtilisateurModel();
        $email = $this->request->getVar('email');
        $password = $this->request->getVar('password');
        $data = $userModel->where('login', $email)->first();
        if($data){
            $pass = $data['password'];
            $authenticatePassword = password_verify($password, $pass);
            if($authenticatePassword){
                $ses_data = [
                    'id' => $data['id'],
                    'name' => $data['name'],
                    'login' => $data['email'],
                    'isLoggedIn' => TRUE
                ];
                $session->set($ses_data);
                return redirect()->to('/profile');
            
            }else{
                $session->setFlashdata('msg', 'Password is incorrect.');
                return redirect()->to('/signin');
            }
        }else{
            $session->setFlashdata('msg', 'Email does not exist.');
            return redirect()->to('/signin');
        }*/
    }
}
