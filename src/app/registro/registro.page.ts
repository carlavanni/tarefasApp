import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf.validator';
import { ComparacaoValidator } from '../validators/comparacao-validator';
import { UsuariosService } from '../services/usuarios.service';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuario';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  public formRegistro: FormGroup;

  public mensagens_validacao = {
    nome: [
      {tipo: 'required', mensagem: 'O campo nome é obrigatório!'},
      {tipo: 'minlength', mensagem: 'O nome deve ter pelo menos 3 caracteres!'}
    ],
    CPF: [
      {tipo: 'required', mensagem: 'O campo CPF é obrigatório!'},
      {tipo: 'minlength', mensagem: 'O CPF deve ter pelo menos 11 caracteres!'},
      {tipo: 'maxlength', mensagem: 'O CPF deve ter no máximo 14 caracteres!'},
{tipo: 'invalido', mensagem: 'CPF inválido!'}
    ],
    celular: [
         
          {tipo: 'maxlength', mensagem: 'O campo celular deve ter no máximo 16 caracteres!'}
        ],
        dataNascimento: [
          {tipo: 'required', mensagem: 'O campo data de nascimento é obrigatório!'}

        ],

        genero: [
          {tipo: 'required', mensagem: 'O campo genero é obrigatório!'}
        ],
        
   email: [
          {tipo: 'required', mensagem: 'O campo e-mail é obrigatório!'},
          {tipo: 'email', mensagem: 'E-mail inválido!'}
          ],
   senha: [
            {tipo: 'required', mensagem: 'O campo senha é obrigatório!'},
            {tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres!'}
          ],
   confirmarsenha: [
            {tipo: 'required', mensagem: 'O campo confirmar senha é obrigatório!'},
            {tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres!'},
            {tipo: 'comparacao', mensagem:'Deve ser igual a senha!'}         
          ]
  };

  constructor(private formBuilder: FormBuilder, 
    private router: Router,
    private usuariosService : UsuariosService,
    public alertController: AlertController
    ) {
    this.formRegistro = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3) ])],
      CPF: ['', Validators.compose([Validators.required, Validators.minLength(11), 
        Validators.maxLength(14), CpfValidator.cpfValido])],

      celular: ['', Validators.compose([Validators.required, Validators.maxLength(16) ])],
      dataNascimento: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6) ])],
      confirmarsenha: ['', Validators.compose([Validators.required, Validators.minLength(6) ])],
      }, {
        validators: ComparacaoValidator('senha', 'confirmarsenha')
      
    });
   }

  async ngOnInit() {
    this.usuariosService.buscarTodos();
    console.log(this.usuariosService.listaUsuarios);
  }

  public async salvarFormulario(){
    if(this.formRegistro.valid){

      let usuario = new Usuario();
      usuario.nome = this.formRegistro.value.nome;
      usuario.cpf = this.formRegistro.value.cpf;
      usuario.dataNascimento = new Date( this.formRegistro.value.dataNascimento);
      usuario.genero = this.formRegistro.value.genero;
      usuario.celular = this.formRegistro.value.celular;
      usuario.email = this.formRegistro.value.email;
      usuario. senha= this.formRegistro.value.senha;

      if(await this.usuariosService.salvar(usuario)){
        this.exibirAlerta('Sucesso!', 'Usuario salvo com sucesso!');
        this.router.navigateByUrl('/login');
      }else {
        this.exibirAlerta('Erro!', 'Erro ao salvar o usuario!');
      }

    }else{
this.exibirAlerta('ADVERTENCIA!', 'Formulario invalido <br> Verifique os campos do seu formulario!');
    }
  }
  async exibirAlerta(titulo: string, mensagem:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }

 
  public registro (){
    if(this.formRegistro.valid){
console.log('formulário válido!')
this.router.navigateByUrl('/home');
    }else {
console.log('formulário inválido!')
    }
  }

}

