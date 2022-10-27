<?php 
namespace App\Models;  
use CodeIgniter\Model;
  
class UtilisateurModel extends Model{
    protected $table = 'utilisateur';
    
    protected $allowedFields = [
        'name',
        'login',
        'password',
        'created_at'
    ];
}