<?php 
namespace App\Models;  
use CodeIgniter\Model;
  
class UtilisateurModel extends Model{
    protected $table = 'users';
    
    protected $allowedFields = [
        'name',
        'email',
        'password',
        'created_at'
    ];
}