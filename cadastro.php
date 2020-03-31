<?php

require_once "core/Model.php";
class Cadastro extends model {

	public function trazerDados($id) {
		$array = array();
        
		$sql = "SELECT nome,tratamento,Data_Nascimento,CPF,RG,Telefone,Complemento,Nacionalidade,CidadeNatal,Cidade,Foto,ID_EstadoCivil,emp_logo,Empresa,emp_especializacao,Cargo,RelacaoEmprego,DescricaoAtividade,emp_Cep,emp_Logradouro,emp_Endereco,emp_Complemento,emp_Numero,emp_Bairro,emp_Cidade,emp_Estado,emp_Site,emp_Telefone,emp_Ramal,emp_Fax,emp_E_mail,Data_iniciacao,ID_Grau,Data_SessaoElevacao,Data_SessaoExaltacao,NomeSimbolico,Email,login,ID_Loja,Endereco,Numero,Bairro,UF,CEP,Autoriza_End_Irmao,Autoriza_End_Empresa
        FROM irmaos where ID_Irmao =:id";
		$sql = $this->db->prepare($sql);
		$sql->bindValue(':id', $id);
		$sql->execute();

		if($sql->rowCount() > 0) {
			$array = $sql->fetchAll();
		}
       
        return $array;
    }

    public function trazerInfoLoja($id){

        $array = array();

		$sql = "SELECT Id_Loja
		 FROM irmaos where ID_Irmao =:id";
		$sql = $this->db->prepare($sql);
		$sql->bindValue(':id', $id);
		$sql->execute();

		if($sql->rowCount() > 0) {
			$array = $sql->fetchAll();
		}
       
        return $array;

    }
    
    
    public function trazerFamiliares($idIrmao){
        
        $array = array();
        
         $sql = "SELECT * from  irmaos_familiares WHERE ID_Irmao =:idIrmao";
         $sql = $this->db->prepare($sql);
          $sql->bindValue(':idIrmao', $idIrmao);
         $sql->execute();

          if($sql->rowCount() > 0) {
            $array = $sql->fetchAll(\PDO::FETCH_ASSOC);
          }
                              
         return $array;
              
    }
    
    public function inserirFamiliar($idLoja,$idIrmao,$idTipoParentesco,$nomeFamiliar,$dataNacimento,$dataFalecimento,$dataEnlace,
                                    $telefone,$telefoneResidencial,$telefoneTrabalho,$emailFamiliar){
        
        $sql = "INSERT INTO `irmaos_familiares`(`ID_Loja`, `ID_Irmao`, `ID_Tipo_Parentesco`, `NomeFamiliar`, `DataNacimento`, `DataFalecimento`, `DataEnlace`, `Telefone`, `Celuar`,`TelefoneTrabalho`,`EmailFamiliar`) VALUES ('$idLoja','$idIrmao','$idTipoParentesco','$nomeFamiliar','$dataNacimento','$dataFalecimento','$dataEnlace','$telefoneResidencial','$telefone','$telefoneTrabalho','$emailFamiliar')";
        
                         $sql = $this->db->prepare($sql);
                         $sql->execute();
        
    }
    
    public function localizarIrmao($cidade,$loja){
          
           $array = array();
        
           if(empty($cidade)){
              $sql = "SELECT ID_Irmao,Nome,Telefone,Emp_E_mail,Foto,emp_Endereco,emp_Complemento,emp_Numero,emp_Bairro,emp_Cidade,emp_Estado,Endereco,Numero,Bairro,UF,CEP,Cidade FROM irmaos WHERE ID_Loja =:loja AND Autoriza_End_Irmao = 1";
               
              $sql = $this->db->prepare($sql);
              $sql->bindValue(':loja', $loja);
              $sql->execute();

              if($sql->rowCount() > 0) {
                 $array = $sql->fetchAll(\PDO::FETCH_ASSOC);
               }
                       
               return $array;

           }else{
               $sql = "SELECT ID_Irmao,Nome,Telefone,Emp_E_mail,Foto,emp_Endereco,emp_Complemento,emp_Numero,emp_Bairro,emp_Cidade,emp_Estado,Endereco,Numero,Bairro,UF,CEP,Cidade FROM irmaos WHERE Cidade =:cidade AND ID_Loja =:loja AND Autoriza_End_Irmao = 1";
               $sql = $this->db->prepare($sql);
               $sql->bindValue(':cidade', $cidade);
                $sql->bindValue(':loja', $loja);
               $sql->execute();

               if($sql->rowCount() > 0) {
                   $array = $sql->fetchAll(\PDO::FETCH_ASSOC);
                 }
                       
              return $array;

               
           }

         

       }
      
       public function localizarEmpresas($cidade,$id){
          
           $array = array();
           $filtro = array();
           
            if(!empty($cidade)){
               $filtro[] = "emp_Cidade =:cidade";
             }
           if(!empty($id)){
              $filtro[] = "ID_Irmao =:id";
            }
                 
           
           if(empty($cidade) && empty($id)){
              $sql = "SELECT ID_Irmao,Nome,emp_Especializacao,DescricaoAtividade,emp_Telefone,Empresa,Emp_E_mail,emp_Logo,emp_Endereco,emp_Complemento,emp_Numero,emp_Cep,emp_Bairro,emp_Cidade,emp_Estado,emp_Site
              FROM irmaos WHERE Autoriza_End_Empresa = 1";
               
              $sql = $this->db->prepare($sql);
              $sql->execute();

              if($sql->rowCount() > 0) {
                 $array = $sql->fetchAll(\PDO::FETCH_ASSOC);
               }
                       
               return $array;

           }else{
               $sql =  "SELECT ID_Irmao,Nome,DescricaoAtividade,emp_Especializacao,emp_Telefone,Empresa,Emp_E_mail,emp_Logo,emp_Endereco,emp_Cep,emp_Complemento,emp_Numero,emp_Bairro,emp_Cidade,emp_Estado,emp_Site
               FROM irmaos WHERE Autoriza_End_Empresa = 1 AND ".implode(" AND ", $filtro);
               $sql = $this->db->prepare($sql);
               
               if(!empty($cidade)){
                     $sql->bindValue(':cidade', $cidade);
               }
               if(!empty($id)){
                     $sql->bindValue(':id', $id);
               }
             
               $sql->execute();

               if($sql->rowCount() > 0) {
                   $array = $sql->fetchAll(\PDO::FETCH_ASSOC);
                 }
                       
              return $array;

               
           }
       }
    
    


    public function meusIrmaos($id){
       
        $array = array();

        $sql = "SELECT Telefone,Email,Nome,Cidade,Foto
         FROM irmaos  where ID_Loja =:id ORDER BY Tratamento ";
        $sql = $this->db->prepare($sql);
        $sql->bindValue(':id', $id);
        $sql->execute();

        if($sql->rowCount() > 0) {
            $array = $sql->fetchAll(\PDO::FETCH_ASSOC);
        }
       
        return $array;
    }


    public function trazerProfissoes(){
      
        $array = array();
        $array2 = array();

        //Adicionando valor nulo
        $array[]["Descricao"] = "";
        
        $sql = "SELECT Descricao,ID
        FROM atividade_profissional ORDER BY Descricao";

        $sql = $this->db->prepare($sql);
         $sql->execute();

        if($sql->rowCount() > 0) {
            $array2 = $sql->fetchAll(\PDO::FETCH_ASSOC);
        }
        
        //Pasando valores de array para o outro que vai ser retornado
         foreach ($array2 as $key => $value) {
          	# code...
          	array_push($array, $array2[$key]);
          } 


        return $array;



    }
    
    public function trazerCidades(){
        
          $array = array();
        
          $sql = "SELECT CodMunicipio,NomeMunicipio
                FROM municipio";
        
          $sql = $this->db->prepare($sql);
          $sql->execute();
        
        if($sql->rowCount() > 0) {
            $array = $sql->fetchAll(\PDO::FETCH_ASSOC);
        }
        
          return $array;
    }
    
    public function trazerEstado(){
           
             $array = array();
           
             $sql = "SELECT id,uf
                   FROM estado";
           
             $sql = $this->db->prepare($sql);
             $sql->execute();
           
           if($sql->rowCount() > 0) {
               $array = $sql->fetchAll(\PDO::FETCH_ASSOC);
           }
           
             return $array;
       }


    public function trazerInformacoesLoja(){
       
         $array = array();
         $array2 = array();
          $array[]["NomeLoja"] = "";

         $sql = "SELECT ID,NomeLoja from loja";
         $sql = $this->db->prepare($sql);
         $sql->execute();
 
        if($sql->rowCount() > 0) {
            $array2 = $sql->fetchAll(\PDO::FETCH_ASSOC);
        }
         //Pasando valores de array para o outro que vai ser retornado
         foreach ($array2 as $key => $value) {
          	# code...
          	array_push($array, $array2[$key]);
          } 
        

        return $array;


    }


    public function filtroDeInformacoesProfissionais(){
       
         $array = array();
         $array2 = array();

          $array[0]["Nome"] = "";

         $sql = "SELECT Nome from irmaos";
          $sql = $this->db->prepare($sql);
         $sql->execute();
 
        if($sql->rowCount() > 0) {
            $array2 = $sql->fetchAll(\PDO::FETCH_ASSOC);
        }

        foreach ($array2 as $key => $value) {
        	# code...
        	array_push($array, $array2[$key]);
        }

        return $array;

    }




    public function trazerDadosProfissionais($idLoja,$proffisao,$areaDeAtuacao,$cidade,$irmao,$estado,$idIrmao){
         
         $array = array();
         $filtro = array();
         
           if(!empty($idLoja)){
                 $filtro[] = "ID_Loja =:idLoja";
           }
        
            if(!empty($idIrmao)){
                 $filtro[] = "ID_Irmao =:idIrmao";
                }

           if(!empty($proffisao)){
             $filtro[] = "ID_Profissao =:proffisao";
            
              
           }

           if(!empty($areaDeAtuacao)){
             $filtro[] = "Cargo =:areaDeAtuacao";
            
           }

           if(!empty($cidade)){
              $filtro[] = "Cidade=:cidade";
             
               
           }

           if(!empty($irmao)){
               
               $filtro[] = "Nome =:irmao";
           }
        
           if(!empty($estado)){
               
               $filtro[] = "emp_Estado =:estado";
           }
           
           //Todo mundo vazio
           if(empty($irmao) && empty($cidade) && empty($areaDeAtuacao) && empty($proffisao) && empty($idLoja) && empty($estado) && empty($idIrmao)){
                  $array = array();

                  $sql = "SELECT Nome,Telefone,Email,Foto,Cargo,RelacaoEmprego,emp_logo,Empresa,DescricaoAtividade,emp_Logradouro,
          emp_Endereco,emp_Complemento,emp_Numero,emp_Bairro,emp_Cidade,emp_Estado,emp_Cep,emp_Telefone,emp_Ramal,emp_Fax,
                      emp_Site,emp_E_mail from irmaos";

                  $sql = $this->db->prepare($sql);
                  $sql->execute();

                  if($sql->rowCount() > 0) {
                   $array = $sql->fetchAll(\PDO::FETCH_ASSOC);
                  }

                 return $array;
           }else{

             $sql  = "SELECT Nome,Telefone,Foto,Email,Cargo,RelacaoEmprego,emp_logo,Empresa,DescricaoAtividade,emp_Logradouro,
          emp_Endereco,emp_Complemento,emp_Numero,emp_Bairro,emp_Cidade,emp_Estado,emp_Cep,emp_Telefone,emp_Ramal,emp_Fax,
          emp_Site,emp_E_mail from irmaos WHERE ".implode(" AND ", $filtro);
          $sql = $this->db->prepare($sql);
           if(!empty($idLoja)){
                
                  $sql->bindValue(':idLoja', $idLoja);

           }
               
               if(!empty($estado)){
                              
                $sql->bindValue(':estado', $estado);

              }
               
               if(!empty($idIrmao)){
                                            
                 $sql->bindValue(':idIrmao', $idIrmao);

                }
               
               

           if(!empty($proffisao)){
            
                $sql->bindValue(':proffisao', $proffisao);
           }

           if(!empty($areaDeAtuacao)){
          
               $sql->bindValue(':areaDeAtuacao', $areaDeAtuacao);
            
           }

           if(!empty($cidade)){
             
               $sql->bindValue(':cidade', $cidade);
           }

           if(!empty($irmao)){
              $sql->bindValue(':irmao', $irmao);
             
           }
         $sql->execute();
 
        if($sql->rowCount() > 0) {
            $array = $sql->fetchAll(\PDO::FETCH_ASSOC);
        }

        return $array;

      }

    
   
    }
    
    
    
    


    public function atualizarDados($dados){
    	try{
    		 $nome  = $dados->dados[0]->nome;
    		 $idIrmao = $dados->dados[0]->idIrmao;
    		 $tratamento  = $dados->dados[0]->tratamento;
    		 $Data_Nascimento = $dados->dados[0]->dataNascimento;
    		 $cpf  = $dados->dados[0]->cpf;
    		 $rg = $dados->dados[0]->rg;
             $complemento = $dados->dados[0]->Complemento;
    		 $Telefone = $dados->dados[0]->telefone;
    		 $nacionalidade = $dados->dados[0]->nacionalidade;
    		 $cidadenatal = $dados->dados[0]->cidadeNatal;
    		 $cidade  = $dados->dados[0]->cidade;
            $empresa = $dados->dados[0]->empresa;
    		 $especializacao = $dados->dados[0]->especializacao;
    		 $cargo  = $dados->dados[0]->cargo;
    		 $relacaoEmprego =  $dados->dados[0]->relacaoEmprego;
    		 $DescricaoAtividade = $dados->dados[0]->descricaoAtividade;
    		 $cepEmpresa = $dados->dados[0]->cepEmpresa;
    		 $logradouro = $dados->dados[0]->empLogradouro;
    		 $empresaEndereco = utf8_encode($dados->dados[0]->empEndereco);
    		 $empresaComplemento = $dados->dados[0]->empComplemento;
    		 $empresaNumero  = $dados->dados[0]->empNumero;
    		 $empresaBairro = $dados->dados[0]->empBairro;
            $empresaCidade =$dados->dados[0]->empCidade;
            $empresaEstado = $dados->dados[0]->empEstado;
            $empresaSite  = $dados->dados[0]->empSite;
    		 $empresaTelefone  = $dados->dados[0]->empTelefone;
    		 $empresaRamal  = $dados->dados[0]->empRamal;
    		 $empresaFax  = $dados->dados[0]->empFaz;
    		 $empresaEmail = $dados->dados[0]->emp_E_mail;
             $foto = base64_decode($dados->dados[0]->foto);
             $bairro  =  $dados->dados[0]->bairro;
             $endereco  =  $dados->dados[0]->endereco;
             $cep = $dados->dados[0]->cep;
             $uf = $dados->dados[0]->uf;
             $numero = $dados->dados[0]->numero;
             $autoriza_end_irmao = $dados->dados[0]->autoriza_end_irmao;
             $autoriza_end_empresa = $dados->dados[0]->autoriza_end_empresa;
              
    		 //$dataIniciacao = $data->dados[0]->Data_Iniciacao;
    		 //$idGrau = $data->dados[0]->IDGrau;
    		 //$Data_SessaoElevacao = $data->dados[0]->Data_SessaoElevacao;
    		 //$Data_SessaoExaltacao = $data->dados[0]->Data_SessaoExaltacao;
    		 $NomeSimbolico = $dados->dados[0]->NomeSimbolico;
    		 $email  = $dados->dados[0]->Email;
    		 //$login = $data->dados[0]->login;
            
            $sql = "UPDATE irmaos SET Nome='$nome',Data_Nascimento='$Data_Nascimento',Tratamento='$tratamento',
                                 CPF='$cpf',RG='$rg',Telefone='$Telefone',Nacionalidade='$nacionalidade',CidadeNatal='$cidadenatal',Cidade=
                                 '$cidade',Empresa='$empresa',Complemento='$complemento',
                                 emp_Cep='$cepEmpresa',emp_Logradouro='$logradouro',emp_Endereco='$empresaEndereco',emp_Complemento=
                                 '$empresaComplemento',emp_Numero='$empresaNumero',emp_Cidade='$empresaCidade',
                                 emp_Estado='$empresaEstado',emp_Site='$empresaSite',emp_Telefone='$empresaTelefone',emp_Ramal='$empresaRamal',
                                 emp_Fax='$empresaFax',emp_E_mail='$empresaEmail',NomeSimbolico='$NomeSimbolico',Cargo='$cargo',emp_especializacao='$especializacao',
                                Email='$email',RelacaoEmprego='$relacaoEmprego',Foto='$foto',Bairro='$bairro',Endereco='$endereco',Numero='$numero',
                                CEP='$cep',UF='$uf',Autoriza_End_Irmao='$autoriza_end_irmao',Autoriza_End_Empresa='$autoriza_end_empresa'
                                 
                                  where ID_Irmao='$idIrmao'";
    		 
    		 
		     $sql = $this->db->prepare($sql);
		     $sql->execute();
		     
            
            return $foto;

    	}catch(Execption $e){
            return $e;
    	}
    }
}

