php
if ($_SERVER[REQUEST_METHOD] == POST) {
    $email = $_POST['email'];
    $password = $_POST['password'];

     Traitez les données comme vous le souhaitez (par exemple, les enregistrer dans une base de données ou valider)
    echo Email  . htmlspecialchars($email) . br;
    echo Mot de passe  . htmlspecialchars($password);
}

