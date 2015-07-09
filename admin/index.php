<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Membership Admin</title>

    <!-- Bootstrap core CSS -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="http://getbootstrap.com/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

    <div class="container">
        <div class="row">
          <div class="col-md-12">
            <h1>Membership Data</h1>
            <hr>
            <p>
            <?php
                $con = mysql_connect("localhost","root","password");
                if (!$con) {
                  die('Connection Error: ' . mysql_error());
                }

                mysql_select_db("ptsamembership", $con);

                $result = mysql_query("select count(1) FROM form");
                $row = mysql_fetch_array($result);

                $total = $row[0];
                echo "Total Signed Up Members: " . $total;

                mysql_close($con);
            ?>
            </p>
            <a href="http://nmsptsa.com/membership/admin/download.php" class="btn btn-success">Download Membership Data (Excel Format) <i class="fa fa-cloud-download"></i></a>
          </div>
        </div>
        <hr>
        <div class="footer">2015 NMS PTSA - coded and designed by Matthew Reck. Orders are securely processed over SSL to protect personal information. NMS PTSA is not responsible for possible credit card theft, we do not store credit card data, it is handled by Paypal. Furthermore, refunds will not be given after purchases are complete. If you have any issues please contact us. <br> <br> <b>Version 1 build 157 - running on <a href="http://nmsptsa.com">http://nmsptsa.com/membership/admin</a></b></div>
    </div><!-- /.container -->


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    
  </body>
</html>





