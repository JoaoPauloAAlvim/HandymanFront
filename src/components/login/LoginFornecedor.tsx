import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../Loading';
import { URLAPI } from '../../constants/ApiUrl';
import { jwtDecode } from 'jwt-decode';



export const LoginFornecedor = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');

    

    const navigate = useNavigate();

    const onNavigateCadastroFornecedor = () => { navigate('/cadastro-fornecedor') };

    const onNavigateLoginUsuario = () => {
        navigate('/login');
      };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${URLAPI}/fornecedor/login`, {
                email,
                senha,
            });
            setIsLoading(false);
            const token = response.data.token;
            localStorage.setItem('token', token);
            // Decodifica o token para pegar o id
            const decoded: any = jwtDecode(token);
            // Busca o fornecedor pelo id para pegar a média de avaliações
            const fornecedorResp = await axios.get(`${URLAPI}/fornecedor/${decoded.id}`);
            const media = fornecedorResp.data.media_avaliacoes;
            const totalAvaliacoes = fornecedorResp.data.totalAvaliacoes || 0;
            if (typeof media === 'number' && media <= 2 && totalAvaliacoes > 2) {
                setError('Sua conta foi bloqueada devido à baixa avaliação. Entre em contato com o suporte.');
                localStorage.removeItem('token');
                setTimeout(() => navigate('/login-fornecedor'), 2000);
                return;
            }
            navigate('/');
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.error || 'Erro ao fazer login');
        }
    };

    return (

        <div className="w-full max-w-[370px] mx-auto my-8 shadow-lg p-6 rounded-md">

            {/* Loading Spinner */}
            {isLoading && (<Loading />)}

            {/* Seção Superior */}
            <div className="text-left mb-4 px-2">
                <h1 className="text-xl font-bold text-text-brown">HANDYMAN</h1>
                <h2 className="text-sm text-text-brown">Não faça você mesmo,</h2>
                <h2 className="text-sm text-text-brown">encontre um proficional!</h2>
                <p className="text-xs text-text-brown mt-0.5">A sua plataforma confiável para serviços manuais!</p>
            </div>

            {/* Seção do Formulário */}
            <div className="bg-[#EEB16C] rounded-lg p-3">

                <form onSubmit={handleSubmit} className="space-y-2.5">
                    <div className="space-y-1">
                        <div className="text-left w-full">
                            <label htmlFor="email" className="inline-block text-xs text-white">
                                Email
                            </label>
                        </div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="text-left w-full">
                            <label htmlFor="password" className="inline-block text-xs text-white">
                                Senha
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-[#AD5700]/50 p-1 rounded-md"
                            >
                                {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                            </button>
                        </div>
                    </div>

                    <div className="text-right">
                        <a href="#" className="text-xs text-white hover:underline">
                            Esqueceu a senha?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="w-full p-2 bg-[#AD5700] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                    >
                        Login
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-white">
                            Não tem uma conta?{' '}
                            <a onClick={onNavigateCadastroFornecedor} className="text-white cursor-pointer hover:underline">
                                Cadastre-se
                            </a>
                        </p>
                        <p className='text-red-600 pt-1'>{error}</p>
                    </div>
                </form>
            </div>
            <p onClick={onNavigateLoginUsuario}
                className="w-full p-2 cursor-pointer text-amber-600 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium text-center mt-4">
                Entrar como Usuário
            </p>
        </div>
    );
}; 