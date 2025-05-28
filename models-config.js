const modelsConfig = {
    tiny: {
        name: 'Tiny Model',
        parameters: '< 1B',
        description: 'Modello leggero ideale per task semplici e deployment su dispositivi con risorse limitate',
        useCases: [
            'Classificazione di testo',
            'Sentiment analysis',
            'Named Entity Recognition semplice'
        ],
        trainingTime: '1-2 giorni',
        costRange: '€1,500 - €2,500',
        models: [
            {
                name: 'BERT-Tiny',
                parameters: '4.4M',
                source: 'https://huggingface.co/prajjwal1/bert-tiny'
            },
            {
                name: 'DistilBERT',
                parameters: '66M',
                source: 'https://huggingface.co/distilbert-base-uncased'
            },
            {
                name: 'ALBERT',
                parameters: '12M',
                source: 'https://huggingface.co/albert-base-v2'
            }
        ]
    },
    small: {
        name: 'Small Model',
        parameters: '1-3B',
        description: 'Modello bilanciato per la maggior parte dei task di NLP con buone performance',
        useCases: [
            'Generazione di testo',
            'Summarization',
            'Question Answering',
            'Named Entity Recognition avanzato'
        ],
        trainingTime: '2-3 giorni',
        costRange: '€2,000 - €3,000',
        models: [
            {
                name: 'OPT-1.3B',
                parameters: '1.3B',
                source: 'https://huggingface.co/facebook/opt-1.3b'
            },
            {
                name: 'BLOOM-1.7B',
                parameters: '1.7B',
                source: 'https://huggingface.co/bigscience/bloom-1.7b'
            },
            {
                name: 'GPT-Neo-2.7B',
                parameters: '2.7B',
                source: 'https://huggingface.co/EleutherAI/gpt-neo-2.7B'
            }
        ]
    },
    medium: {
        name: 'Medium Model',
        parameters: '3-7B',
        description: 'Modello potente per task complessi che richiedono comprensione profonda e generazione sofisticata',
        useCases: [
            'Generazione di testo avanzata',
            'Analisi semantica complessa',
            'Traduzione multilingua',
            'Reasoning e problem solving'
        ],
        trainingTime: '3-5 giorni',
        costRange: '€3,000 - €5,000',
        models: [
            {
                name: 'BLOOM-7B',
                parameters: '7B',
                source: 'https://huggingface.co/bigscience/bloom-7b1'
            },
            {
                name: 'OPT-6.7B',
                parameters: '6.7B',
                source: 'https://huggingface.co/facebook/opt-6.7b'
            },
            {
                name: 'GPT-J-6B',
                parameters: '6B',
                source: 'https://huggingface.co/EleutherAI/gpt-j-6B'
            }
        ]
    }
};

export default modelsConfig; 