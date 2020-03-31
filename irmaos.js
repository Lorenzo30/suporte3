import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ImageBackground, TextInput, Image, ScrollView, TouchableHighlight, Alert,Picker,Switch } from 'react-native';
import { connect } from "react-redux";
import { TrazerDadosIrmao, atualizarDados, atualizarSenha } from "../actions/CadastroAction";
import { TextInputMask } from 'react-native-masked-text';
import SafeAreaView from 'react-native-safe-area-view';
import Loading from "../Components/LoadingItem";
import BotaoVoltar from "../Components/botaoVoltar";
import ImagePicker from 'react-native-image-picker';
import { Avatar } from 'react-native-elements';
import RNFetchBlob from 'rn-fetch-blob';
import firebase from "../forebaseConnection";
import { trazerHistoricoBalaustre } from '../actions/balaustreAction';

const utf8 = require ('utf8');   

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = RNFetchBlob.polyfill.Blob;

const Fetch = RNFetchBlob.polyfill.Fetch
// replace built-in fetch
window.fetch = new Fetch({
    // enable this option so that the response data conversion handled automatically
    auto: true,
    // when receiving response data, the module will match its Content-Type header
    // with strings in this array. If it contains any one of string in this array, 
    // the response body will be considered as binary data and the data will be stored
    // in file system instead of in memory.
    // By default, it only store response data to file system when Content-Type 
    // contains string `application/octet`.
    binaryContentTypes: [
        'image/',
        'video/',
        'audio/',
        'foo/',
    ]
}).build()

export class Irmaoes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dados: [
                {
                    nome: "", tratamento: "", dataNascimento: "", cpf: "", rg: "", telefone: "", nacionalidade: "", cidadeNatal: "", cidade: "", foto: "",
                    empresa: "", especializacao: "", cargo: "", relacaoEmprego: "", descricaoAtividade: "", cepEmpresa: "", empLogradouro: "",cep:"",uf:"",
                    endereco:"",bairro:"",numero:"",Complemento:"",
                    empEndereco: "", empComplemento: "", empNumero: "", empBairro: "", empCidade: "", empEstado: "", empSite: "", empTelefone: "",
                    empRamal: "", empFaz: "", emp_E_mail: "", Data_Iniciacao: "", IDGrau: "", Data_SessaoElevacao: "", Data_SessaoExaltacao: "",
                    NomeSimbolico: "", Email: "", Login: "", idIrmao: this.props.resultadoLogin[3],autoriza_end_irmao:"",autoriza_end_empresa:""
                }
            ],
            imgTmp: "",
            cidade: "",
            novaSenha: "",
            data: ""

        }
        this.atualizar = this.atualizar.bind(this);
        this.props.TrazerDadosIrmao(this.state, this.props.resultadoLogin[3]);
        this.estruturarData2 = this.estruturarData2.bind(this);
        this.ref = null;
        this.choseImage = this.choseImage.bind(this);
        this.buscaCep = this.buscaCepPessoal.bind(this);
        this.buscaCep = this.buscaCepEmpresarial(this);
        
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Meu Cadastro",
            headerLeft: () => (
                <BotaoVoltar cor="#000000" marginLeft={10} onPress={() => navigation.navigate("telaInicial")} />
            ),
        }
    };

    componentDidMount() {
        if (this.props.dadosIrmao != "") {
            this.props.state = this.props.dadosIrmao;
        }
    }

    estruturarData(data) {
        if (!!data) {
            let data2 = data.split("-");
            return data2[2] + "-" + data2[1] + "-" + data2[0];
        } else {
            return "00/00/0000"
        }
    }

    estruturarData2(data) {

        let newdata = data.split("/");
        let dataFormatada = newdata[2] + "-" + newdata[1] + "-" + newdata[0];
        return dataFormatada;


    }
    mascaraGrau(grau) {
        switch (grau) {
            case "1":
                return "Grau 1  A.·.M.·."
                break;

            case "2":
                return "Grau 2  C.·.M.·."
                break;

            case "3":
                return "Grau 3  M.·.M.·."
                break;

            case "4":
                return "Grau 4  M.·. Secreto"
                break;

            case "5":
                return "Grau 5  M.·. Perfeito"
                break;

            case "6":
                return "Grau 6  Secr.·. Íntimo"
                break;

            case "7":
                return "Grau 7  Preb.·. e Juiz ou M.·. Irlanês"
                break;

            case "8":
                return "Grau 8  Inten.·. dos Edifícios ou M.·. Em Israel"
                break;

            case "9":
                return "Grau 9  Cav.·. Eleito dos Nove"
                break;

            case "10":
                return "Grau 10 Cav.·. Eleito dos Quinze"
                break;

            case "11":
                return "Grau 11 Cav.·. Eleito dos Doze ou Subl.·. Cav.·. E..."
                break;

            case "12":
                return "Grau 12 Gr.·.M.·. Arquiteto"
                break;
            case "13":
                return "Grau 13 Cav.·. do Real Arco"
                break;

            case "14":
                return "Grau 14 Perf.·. e Sub.·. Maçom ou G.·. Eleito"
                break;
            case "15":
                return "Grau 15 Cav.·. do Oriente da Esp.·. e da Águia"
                break;

            case "16":
                return "Grau 16 Princ.·. de Jerusalém"
                break;
            case "17":
                return "Grau 17 Cav.·. do Oriente e do Ocidente"
                break;
            case "18":
                return "Grau 18 Cav.·. Rosa Cruz ou Cav.·. Águia Branca"
                break;
            case "19":
                return "Grau 19 Gran.·. Pontífice ou Sub.·. Escocês"
                break;
            case "20":
                return "Grau 20 Sob.·. Princ.·. da Maçonaria ou M.·. Ad Vitam"
                break;

            case "21":
                return "Grau 21 Noaquita ou Cav.·. Prussiano"
                break;
            case "22":
                return "Grau 22 Cav.·. Real Machado ou Princ.·. do Líbano"
                break;
            case "23":
                return "Grau 23 Chefe do Tabernáculo"
                break;
            case "24":
                return "Grau 24 Princ.·. do Tabernáculo"
                break;
            case "25":
                return "Grau 25 Cav.·. da Serpente de Bronze"
                break


        }

    }

    async  buscaCepPessoal (cep){
        const url = encodeURI("https://viacep.com.br/ws/"+cep+"/json/");
         
        const res  = await fetch(url);
        const json  = res.json();

        const bairro  = json["_55"]["bairro"];
        const cidade = json["_55"]["localidade"];
        const uf = json["_55"]["uf"];

        let state  = this.state;
        state.dados[0].bairro = bairro;
        state.dados[0].cidade = cidade;
        state.dados[0].uf = uf;
        state.dados[0].endereco = `${bairro} - ${cidade} - ${uf}`;
        
        this.setState(state);
    }

    async  buscaCepEmpresarial (cep){
        const url = encodeURI("https://viacep.com.br/ws/"+cep+"/json/");
         
        const res  = await fetch(url);
        const json  = res.json();

        const bairro  = json["_55"]["bairro"];
        const cidade = json["_55"]["localidade"];
        const uf = json["_55"]["uf"];

        let state  = this.state;
        state.dados[0].empBairro = bairro;
        state.dados[0].empCidade = cidade;
        state.dados[0].empEstado = uf;
        state.dados[0].empEndereco = `${bairro} - ${cidade} - ${uf}`;
        
        this.setState(state);

        console.log(json);
    }


    choseImage() {

        const options = {
            maxHeight: 250,
            maxWidth: 250,
            title: "Selecionar uma foto",
            takePhotoButtonTitle: "Tirar uma foto agora",
            chooseFromLibraryButtonTitle: "Escolher uma imagem da galeria",
            cancelButtonTitle: "Cancelar"
        };
        let state = this.state;
        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                let uri = response.uri.replace('file://', '');

                RNFetchBlob.fs.readFile(uri, 'base64')
                    .then((data) => {
                        let image = "data:image/jpg;base64," + response.data;
                        state.dados[0].foto = response.data;
                        state.imgTmp = image;
                        this.setState(state);

                        return RNFetchBlob.polyfill.Blob.build(data, { type: "image/jpeg;BASE64" });
                    })
            }

        })
    }

    atualizar() {
        let dados = this.state;

        dados.dados[0].cpf = this.cpfField.getRawValue();
        dados.dados[0].telefone = this.phoneField.getRawValue();
        dados.dados[0].cepEmpresa = this.cepField.getRawValue();
        dados.dados[0].cep = this.cepFieldIrmao.getRawValue();

        let dataOriginal = dados.dados[0].dataNascimento;
         
        if(!!dados.dados[0].dataNascimento){
            let teste = this.estruturarData2(dados.dados[0].dataNascimento);
            dados.dados[0].dataNascimento = teste;
        }
       
      
        this.setState(dados);

        if (!!dados.novaSenha) {
            this.props.atualizarSenha(this.props.resultadoLogin[0], this.state.novaSenha)
            let array = dados.dados;
            this.props.atualizarDados(array);
            
            //Atualizar foto no firebase
            firebase.database().ref("users").child(this.props.idusuario).child("foto").set(dados.dados[0].foto);
        

            Alert.alert("Entremasons", "Senha alterada com sucesso e dados Atualizados");
            this.props.navigation.navigate("logout", null);

        } else {
            let array = dados.dados
            this.props.atualizarDados(array);

            //Atualizar foto no firebase
            firebase.database().ref("users").child(this.props.idusuario).child("foto").set(dados.dados[0].foto);

            let dados2 = this.state;
            dados2.dados[0].dataNascimento = dataOriginal;
            this.setState(dados2);


            Alert.alert("Entremasons", "Dados atualizados com sucesso");



        }


    }

    render() {
        if (!!this.state.dados) {
            return (
                <SafeAreaView style={styles.body}>
                    <View style={styles.body}>
                        <ScrollView>
                            <View style={styles.areaImage}>
                                <Avatar
                                    onEditPress={() => this.choseImage()}
                                    showEditButton
                                    size="large"
                                    rounded
                                    source={{
                                        uri: this.state.imgTmp,
                                    }}
                                />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Nome: </Text>
                                <TextInput value={this.state.dados[0].nome} style={styles.inputInfo} onChangeText={(nome) => {
                                    let state = this.state;
                                    state.dados[0].nome = nome;
                                    this.setState(state);
                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Tratamento: </Text>
                                <TextInput value={this.state.dados[0].tratamento} style={styles.inputInfo} onChangeText={(tratamento) => {
                                    let state = this.state;
                                    state.dados[0].tratamento = tratamento;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Data de Nascimento: </Text>
                                <TextInputMask
                                    style={styles.inputInfo}
                                    type={'datetime'}
                                    options={{
                                        format: "DD/MM/YYYY"
                                    }}
                                    value={this.state.dados[0].dataNascimento}
                                    onChangeText={text => {
                                        let state = this.state;
                                        state.dados[0].dataNascimento = text;
                                        this.setState(state);
                                    }}
                                />
                            </View>


                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Cpf: </Text>

                                <TextInputMask
                                    style={styles.inputInfo}
                                    type={'cpf'}
                                    value={this.state.dados[0].cpf}
                                    onChangeText={text => {
                                        this.ref = text;
                                        let state = this.state;
                                        state.dados[0].cpf = text;
                                        this.setState(state);

                                    }}
                                    ref={(ref) => this.cpfField = ref}
                                />
                            </View>


                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Rg: </Text>
                                <TextInput value={this.state.dados[0].rg} style={styles.inputInfo} onChangeText={(rg) => {
                                    let state = this.state;
                                    state.dados[0].rg = rg;
                                    this.setState(state);
                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Telefone: </Text>
                                <TextInputMask
                                    style={styles.inputInfo}
                                    type={'cel-phone'}
                                    options={{

                                        maskType: "BRL",
                                        withDDD: true,
                                        dddMask: "(51)"

                                    }}
                                    value={this.state.dados[0].telefone}
                                    onChangeText={text => {
                                        this.ref = text;
                                        let state = this.state;
                                        state.dados[0].telefone = text;
                                        this.setState(state);



                                    }}
                                    ref={(ref) => this.phoneField = ref}

                                />

                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Nacionalidade: </Text>
                                <TextInput value={this.state.dados[0].nacionalidade} style={styles.inputInfo} onChangeText={(nacionalidade) => {
                                    let state = this.state;
                                    state.dados[0].nacionalidade = nacionalidade;
                                    this.setState(state);
                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Cidade Natal: </Text>
                                <TextInput value={this.state.dados[0].cidadeNatal} style={styles.inputInfo} onChangeText={(cidadeNatal) => {
                                    let state = this.state;
                                    state.dados[0].cidadeNatal = cidadeNatal;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Cidade: </Text>
                                <TextInput value={this.state.dados[0].cidade} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].cidade = cidade;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Endereço: </Text>
                                <TextInput value={this.state.dados[0].endereco} style={styles.inputInfo} onChangeText={(endereco) => {
                                    let state = this.state;
                                    state.dados[0].endereco = endereco;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Complemento: </Text>
                                <TextInput value={this.state.dados[0].Complemento} style={styles.inputInfo} onChangeText={(endereco) => {
                                    let state = this.state;
                                    state.dados[0].Complemento = endereco;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Bairro: </Text>
                                <TextInput value={this.state.dados[0].bairro} style={styles.inputInfo} onChangeText={(bairro) => {
                                    let state = this.state;
                                    state.dados[0].bairro = bairro;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Numero: </Text>
                                <TextInput value={this.state.dados[0].numero} style={styles.inputInfo} onChangeText={(numero) => {
                                    let state = this.state;
                                    state.dados[0].numero = numero;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> UF: </Text>
                                <TextInput value={this.state.dados[0].uf} style={styles.inputInfo} onChangeText={(uf) => {
                                    let state = this.state;
                                    state.dados[0].uf = uf;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Cep </Text>

                                <TextInputMask
                                    style={styles.inputInfo}
                                    type={'zip-code'}
                                    value={this.state.dados[0].cep}
                                    onChangeText={text => {
                                        this.ref = text;
                                        let state = this.state;
                                        state.dados[0].cep = text;
                                        this.setState(state);
                                    }}

                                    ref={(ref) => this.cepFieldIrmao = ref}
                                />

                                <TouchableHighlight onPress={() => this.buscaCepPessoal(this.state.dados[0].cep)} style={[styles.botao,{marginTop:5,marginLeft:0}]}> 
                                     <Text style={{fontSize:17,color:"#fff"}}> Buscar Cep </Text>

                                </TouchableHighlight>
                            </View>
                            <View style={[styles.areaInfo,{borderWidth:1,borderRadius:5,padding:10,borderColor:"#ccc",flexDirection:"row",alignItems:"center"}]}>
                                <Text style={{fontSize:15,marginRight:10}}> Autorizar minha localização   </Text>
                                <Switch  
                                 onValueChange={() => { 
                                   let state  = this.state;
                                   state.dados[0].autoriza_end_irmao = state.dados[0].autoriza_end_irmao == 1 ? 0 : 1
                                   this.setState(state);
                                   console.log("aquiii",this.state.dados[0].autoriza_end_irmao)
                                 } }
                                 value={this.state.dados[0].autoriza_end_irmao == 1 ? true : false}
                                
                                /> 
                            </View>

                            <View style={[styles.areaInfo, { backgroundColor: "#dfaf5b", borderRadius: 10, padding: 10 }]}>
                                <Text style={[styles.textoInfo, { fontSize: 20, color: "#fff" }]}>  Dados profissionais: </Text>
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Empresa: </Text>
                                <TextInput value={this.state.dados[0].empresa} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].empresa =  cidade
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Especialização </Text>
                                <TextInput value={this.state.dados[0].especializacao} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].especializacao = cidade;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Cargo </Text>
                                <TextInput value={this.state.dados[0].cargo} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].cargo = cidade;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Relação Emprego </Text>
                                <TextInput value={this.state.dados[0].relacaoEmprego} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].relacaoEmprego = cidade;
                                    this.setState(state);

                                }} />
                            </View>



                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Cep </Text>

                                <TextInputMask
                                    style={styles.inputInfo}
                                    type={'zip-code'}
                                    value={this.state.dados[0].cepEmpresa}
                                    onChangeText={text => {
                                        this.ref = text;
                                        let state = this.state;
                                        state.dados[0].cepEmpresa = text;
                                        this.setState(state);
                                    }}

                                    ref={(ref) => this.cepField = ref}
                                />
                                  
                                  <TouchableHighlight onPress={() => this.buscaCepEmpresarial(this.state.dados[0].cepEmpresa)} style={[styles.botao,{marginTop:5,marginLeft:0}]}> 
                                     <Text style={{fontSize:17,color:"#fff"}}> Buscar Cep </Text>

                                </TouchableHighlight>

                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Logradouro </Text>
                                <TextInput value={this.state.dados[0].empLogradouro} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].empLogradouro = cidade;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Endereço </Text>
                                <TextInput value={this.state.dados[0].empEndereco} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].empEndereco = cidade;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Complemento </Text>
                                <TextInput value={this.state.dados[0].empComplemento} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].empComplemento = cidade;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Numero </Text>
                                <TextInput value={this.state.dados[0].empNumero} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].empNumero = cidade;
                                    this.setState(state);

                                }} />
                            </View>



                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Cidade </Text>
                                <TextInput value={this.state.dados[0].empCidade} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].empCidade = cidade;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Estado </Text>
                                <TextInput value={this.state.dados[0].empEstado} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].empEstado = cidade;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Site </Text>
                                <TextInput value={this.state.dados[0].empSite} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].empSite = cidade;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Ramal </Text>
                                <TextInput value={this.state.dados[0].empRamal} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].empRamal = cidade;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Fax </Text>
                                <TextInput value={this.state.dados[0].empFaz} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].empFaz = cidade;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={[styles.areaInfo,{borderWidth:1,borderRadius:5,padding:10,borderColor:"#ccc",flexDirection:"row",alignItems:"center"}]}>
                            <Text style={{fontSize:15,marginRight:10}}> Autorizar localização da empresa </Text>
                                <Switch  
                                 onValueChange={() => { 
                                   let state  = this.state;
                                   state.dados[0].autoriza_end_empresa = state.dados[0].autoriza_end_empresa == 1 ? 0 : 1
                                   this.setState(state);
                                 } }
                                 value={this.state.dados[0].autoriza_end_empresa == 1 ? true : false}
                                /> 
                            </View>

                            <View style={[styles.areaInfo, { backgroundColor: "#dfaf5b", padding: 10, borderRadius: 10 }]}>
                                <Text style={[styles.textoInfo, { fontSize: 20, color: "#fff" }]}> Registro Maçonico: </Text>
                            </View>


                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Grau </Text>
                                <TextInput value={this.mascaraGrau(this.state.dados[0].IDGrau)} style={[styles.inputInfo, { backgroundColor: "#ccc" }]} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Data de Iniciação </Text>
                                <TextInput value={this.estruturarData(this.state.dados[0].Data_Iniciacao)} style={[styles.inputInfo, { backgroundColor: "#ccc" }]} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Data sessão Elevação </Text>
                                <TextInput value={this.estruturarData(this.state.dados[0].Data_SessaoElevacao)} style={[styles.inputInfo, { backgroundColor: "#ccc" }]} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Data sessão Exaltação </Text>
                                <TextInput value={this.estruturarData(this.state.dados[0].Data_SessaoExaltacao)} style={[styles.inputInfo, { backgroundColor: "#ccc" }]} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Nome Simbolico</Text>
                                <TextInput value={this.state.dados[0].NomeSimbolico} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].NomeSimbolico = cidade;
                                    this.setState(state);

                                }} />
                            </View>

                            <View style={[styles.areaInfo, { backgroundColor: "#dfaf5b", padding: 10, borderRadius: 10 }]}>
                                <Text style={[styles.textoInfo, { color: "#fff", fontSize: 20 }]}>Informações de Login:</Text>
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> E-mail</Text>
                                <TextInput value={this.state.dados[0].Email} style={styles.inputInfo} onChangeText={(cidade) => {
                                    let state = this.state;
                                    state.dados[0].Email = cidade;
                                    this.setState(state);

                                }} />
                            </View>


                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}> Nome de Login</Text>
                                <TextInput value={this.state.dados[0].Login} style={[styles.inputInfo, { backgroundColor: "#ccc" }]} />
                            </View>

                            <View style={styles.areaInfo}>
                                <Text style={styles.textoInfo}>Alterar senha:</Text>
                                <TextInput value={this.state.novaSenha} style={[styles.inputInfo]} onChangeText={(senha) => {
                                    let state = this.state;
                                    state.novaSenha = senha;
                                    this.setState(state);

                                }} placeholder="Digite sua nova senha.." maxLength={20} />
                            </View>



                            <TouchableHighlight style={styles.botao} onPress={() => this.atualizar()}>
                                <Text style={styles.textoBotao}>Atualizar</Text>
                            </TouchableHighlight>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            );

        } else {

            return (
                <View>
                    <Loading visible={true} />
                </View>
            )
        }


    }
}



const styles = StyleSheet.create({
    body: {
        flex: 1
    },
    icon: {
        height: 26,
        width: 26
    },
    textoCabecalho: {
        fontSize: 25,
        color: "#fff",
        marginLeft: 15

    },
    cabecalho: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E7B036",
        height: 70,
        justifyContent: "center"
    },
    areaInfo: {
        flex: 1,
        justifyContent: "center",
        marginBottom: 30,
        marginLeft: 10,
        marginRight: 10
    },
    inputInfo: {
        borderColor: "#cccc",
        borderWidth: 1,
        borderRadius: 5,
        height: 50,
        padding: 10


    },
    textoInfo: {
        flex: 1,
        fontSize: 13,
        color: "#000"
    },
    botao: {
        width: 100,
        color: "#fff",
        height: 50,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#dfaf5b",
        marginLeft: 10,
        marginBottom: 30
    },
    textoBotao: {

        color: "#fff",
        fontSize: 15
    },
    iconeFoto: {

        width: 100,
        height: 100,
        marginTop: 20,
        borderRadius: 50,
        justifyContent: "center"
    },
    areaImage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 15

    }
})


const mapStateToProps = (state) => {
    return {
        resultadoLogin: state.auth.resultadoLogin,
        dadosIrmao: state.cadastro.dados,
        resultadoAtualizacao: state.cadastro.ResultadoAtualizacao,
        idusuario: state.auth.idUsuario
    };
};

const IrmaoConnect = connect(mapStateToProps, { TrazerDadosIrmao, atualizarDados, atualizarSenha })(Irmaoes);
export default IrmaoConnect;