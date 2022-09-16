function verifica_cpf_cnpj ( valor ) {
    // Garantir que é uma string
    valor = valor.toString();
    
    // Remover caracteres inválidos
    valor = valor.replace(/[^0-9]/g, '');
    // Verificar CPF
    if ( valor.length === 11 ) {
        return 'CPF';
    } 
    // Verificar CNPJ
    else if ( valor.length === 14 ) {
        return 'CNPJ';
    }   
    else {
        return false;
    }  
} 

function calc_digitos_posicoes( digitos, posicoes = 10, soma_digitos = 0 ) {
    digitos = digitos.toString();

    //Como funciona(?)
    //  0    2    5    4    6    2    8    8   4
    // x10  x9   x8   x7   x6   x5   x4   x3  x2
    //  0 + 18 + 40 + 28 + 36 + 10 + 32 + 24 + 8 = 196

    for ( var i = 0; i < digitos.length; i++  ) {
        soma_digitos = soma_digitos + ( digitos[i] * posicoes );
        posicoes--;

        //Esse é só do CNPJ
        //fica assim: 5-4-3-2-9-8-7-6-5-4-3-2
        if ( posicoes < 2 ) {
            posicoes = 9;
        }
    }

    soma_digitos = soma_digitos % 11;
    // verificar se soma_digitos é menor que 2
    if ( soma_digitos < 2 ) {
        // soma_digitos agora tem que ser zero
        soma_digitos = 0;
    } else {
        // Se for maior que 2, o resultado é 11 menos soma_digitos:
        // 11 - 9 = 2
        soma_digitos = 11 - soma_digitos;
    }
    var cpf = digitos + soma_digitos;
    return cpf;
} 
    // calc_digitos_posicoes
function valida_cpf( valor ) {
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');
    // Captura os 9 primeiros dígitos do CPF pra ficar assim:
    //02546288423 = 025462884
    var digitos = valor.substr(0, 9);

    // Faz o cálculo dos 9 primeiros dígitos do CPF para obter o primeiro dígito
    var novo_cpf = calc_digitos_posicoes( digitos );

    // Calcula os 10 primeiros digitos do CPf pra adicionar o ultimo 
    var novo_cpf = calc_digitos_posicoes( novo_cpf, 11 );

    // Verifica se o novo CPF gerado é idêntico ao CPF enviado
    if ( novo_cpf === valor ) {
        return true;
    } else {
        return false;
    }   
}

function valida_cnpj ( valor ) {
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');   //(aparece bastante por aqui esse né)
    var cnpj_original = valor;

    // Pegar os primeiros 12 números do CNPJ
    var primeiros_numeros_cnpj = valor.substr( 0, 12 );
    var primeiro_calculo = calc_digitos_posicoes( primeiros_numeros_cnpj, 5 );

    // Esse aqui e igual o segundo, só que começa pelo 6º digito
    var segundo_calculo = calc_digitos_posicoes( primeiro_calculo, 6 );

    // Segundo digito ao CNPJ
    var cnpj = segundo_calculo;
    // Verifica se o CNPJ gerado é identico ao enviado
    if ( cnpj === cnpj_original ) {
        return true;
    }
    // Retorna falso por padrão, afinal, se nao der nao deu né
    return false; 
}

function valida_cpf_cnpj ( valor ) {

    // Verifica se é CPF ou CNPJ
    var valida = verifica_cpf_cnpj( valor );
    valor = valor.toString(); 
    valor = valor.replace(/[^0-9]/g, '');
    if ( valida === 'CPF' ) {
        // Retornar verdadeiro para CPF
        return valida_cpf( valor );
    } 
    else if ( valida === 'CNPJ' ) {
        // Retornar verdadeiro para cnpj
        return valida_cnpj( valor );
    } 
    else {
        return false;
    }  
}

function formata_cpf_cnpj( valor ) {
    var formatado = false;
    // Verifica se é CPF ou CNPJ
    var valida = verifica_cpf_cnpj( valor );
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, '');

    // Valida CPF
    if ( valida === 'CPF' ) {
        if ( valida_cpf( valor ) ) {
        
            // máscara CPF ###.###.###-##
            formatado  = valor.substr( 0, 3 ) + '.';
            formatado += valor.substr( 3, 3 ) + '.';
            formatado += valor.substr( 6, 3 ) + '-';
            formatado += valor.substr( 9, 2 ) + '';          
        }   
    }
    else if ( valida === 'CNPJ' ) {
        if ( valida_cnpj( valor ) ) {
            // Mascara CNPJ ##.###.###/####-##
            formatado  = valor.substr( 0,  2 ) + '.';
            formatado += valor.substr( 2,  3 ) + '.';
            formatado += valor.substr( 5,  3 ) + '/';
            formatado += valor.substr( 8,  4 ) + '-';
            formatado += valor.substr( 12, 14 ) + '';
        }
    } 
    return formatado;  
}