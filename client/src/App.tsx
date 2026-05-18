import { useState } from 'react';
import './App.css';

interface CandidateFormData {
    name: string;
    reason: string;
}

function App() {
    const [formData, setFormData] = useState<CandidateFormData>({
        name: '',
        reason: '',
    });

    const [message, setMessage] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.name.trim() === '') {
            setMessage('Будь ласка, вкажіть імʼя кандидата');
            setIsError(true);
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
          const response = await fetch('https://shower-election.up.railway.app/api/proposes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name.trim(),
            reason: formData.reason.trim() || undefined,
            }),
          });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Помилка сервера');
            }

            const data = await response.json();
            
            setMessage(data.message || 'Кандидата успішно запропоновано!');
            setIsError(false);
            
            setFormData({ name: '', reason: '' });
            
        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage('Не вдалося відправити пропозицію. Спробуйте пізніше.');
            }
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            <h1>Вибори кандидата</h1>
            <p>Неформальні вибори неформального голови
               душу гуртожитку №4 ЧНУ ім. Ю. Федьковича
               серед і для студентів ФМІ на 1-й семестр
                2026-2027 н.р.</p>
            <h2>Запропонувати кандидата</h2>

            {message && (
                <div className={isError ? 'message error' : 'message success'}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="candidate-form">
                <div className="form-group">
                    <label htmlFor="name">Імʼя кандидата *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Кандідаде наме"
                        required
                        maxLength={100}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reason">Чом саме сей кандидат?</label>
                    <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="Опишіть, чому ви пронуєте саме його"
                        rows={4}
                    />
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Відправляєсі...' : 'Запропонувати кандидата'}
                </button>
            </form>
        </div>
    );
}

export default App;