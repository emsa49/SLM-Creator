class ModelCreatorApp {
    constructor() {
        this.currentStep = 1;
        this.formData = {
            businessGoal: '',
            customGoal: '',
            dataVolume: '',
            dataType: '',
            files: [],
            modelSize: '',
            deploymentType: '',
            priority: '',
            selectedPlan: '',
            selectedUseCase: ''
        };
        this.initElements();
        this.bindEvents();
        this.initApp();
    }

    initElements() {
        // Header elements
        this.navLinks = document.querySelectorAll('.main-nav a');
        this.mobileCta = document.querySelector('.mobile-cta');
        
        // Hero elements
        this.startNowBtn = document.getElementById('start-now');
        this.viewDemoBtn = document.getElementById('view-demo');
        
        // Use case buttons
        this.useCaseButtons = document.querySelectorAll('[data-use-case]');
        
        // Pricing buttons
        this.pricingButtons = document.querySelectorAll('[data-plan]');
        
        // CTA buttons
        this.ctaButtons = document.querySelectorAll('.open-wizard');
        
        // Wizard elements
        this.wizardModal = document.getElementById('wizard-modal');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        this.wizardSteps = document.querySelectorAll('.wizard-step');
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.wizardPrevBtn = document.getElementById('wizard-prev');
        this.wizardNextBtn = document.getElementById('wizard-next');
        this.wizardSubmitBtn = document.getElementById('wizard-submit');
        
        // Form elements
        this.businessGoalSelect = document.getElementById('business-goal');
        this.customGoalGroup = document.getElementById('custom-goal-group');
        this.customGoalInput = document.getElementById('custom-goal');
        this.dataVolumeSelect = document.getElementById('data-volume');
        this.dataTypeInputs = document.querySelectorAll('input[name="data-type"]');
        this.fileUpload = document.getElementById('file-upload');
        this.modelSizeSelect = document.getElementById('model-size');
        this.deploymentTypeSelect = document.getElementById('deployment-type');
        this.inferenceSpeedSelect = document.getElementById('inference-speed');
        
        // Preview elements
        this.trainingTime = document.getElementById('training-time');
        this.estimatedCost = document.getElementById('estimated-cost');
        this.previewContent = document.querySelector('.preview-content');
        
        // Summary elements
        this.requirementsSummary = document.getElementById('requirements-summary');
        this.datasetSummary = document.getElementById('dataset-summary');
        this.configSummary = document.getElementById('config-summary');
        this.costsSummary = document.getElementById('costs-summary');
    }

    bindEvents() {
        // Navigation events
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                if (target === '#') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (target.startsWith('#')) {
                    const targetElement = document.querySelector(target);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Use case buttons
        this.useCaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const useCase = button.getAttribute('data-use-case');
                this.formData.selectedUseCase = useCase;
                this.openWizard();
                this.preSelectUseCase(useCase);
            });
        });

        // Pricing buttons
        this.pricingButtons.forEach(button => {
            button.addEventListener('click', () => {
                const plan = button.getAttribute('data-plan');
                this.formData.selectedPlan = plan;
                if (plan === 'enterprise') {
                    window.location.href = '#contact';
                } else {
                    this.openWizard();
                    this.preSelectPlan(plan);
                }
            });
        });

        // CTA buttons
        this.ctaButtons.forEach(button => {
            button.addEventListener('click', () => this.openWizard());
        });

        // Close modal buttons
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.closeWizard());
        });

        // Wizard navigation
        if (this.wizardPrevBtn) {
            this.wizardPrevBtn.addEventListener('click', () => this.navigateWizard('prev'));
        }
        
        if (this.wizardNextBtn) {
            this.wizardNextBtn.addEventListener('click', () => this.navigateWizard('next'));
        }
        
        if (this.wizardSubmitBtn) {
            this.wizardSubmitBtn.addEventListener('click', () => this.submitWizard());
        }

        // Form events
        this.businessGoalSelect.addEventListener('change', () => {
            const isCustom = this.businessGoalSelect.value === 'custom';
            this.customGoalGroup.style.display = isCustom ? 'block' : 'none';
            this.formData.businessGoal = this.businessGoalSelect.value;
            this.updateSummary();
        });

        this.modelSizeSelect.addEventListener('change', () => {
            this.formData.modelSize = this.modelSizeSelect.value;
            this.updateEstimates();
            this.updateSummary();
        });

        this.deploymentTypeSelect.addEventListener('change', () => {
            this.formData.deploymentType = this.deploymentTypeSelect.value;
            this.updateEstimates();
            this.updateSummary();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.wizardModal) {
                this.closeWizard();
            }
        });
    }

    preSelectUseCase(useCase) {
        // Pre-select business goal based on use case
        const useCaseToGoal = {
            'chatbot': 'text-generation',
            'doc-analysis': 'classification',
            'content-gen': 'text-generation'
        };
        
        if (useCaseToGoal[useCase]) {
            this.businessGoalSelect.value = useCaseToGoal[useCase];
            this.formData.businessGoal = useCaseToGoal[useCase];
            this.updateSummary();
        }
    }

    preSelectPlan(plan) {
        // Pre-select model size based on plan
        const planToSize = {
            'starter': 'tiny',
            'professional': 'small',
            'enterprise': 'medium'
        };
        
        if (planToSize[plan]) {
            this.modelSizeSelect.value = planToSize[plan];
            this.formData.modelSize = planToSize[plan];
            this.updateEstimates();
            this.updateSummary();
        }
    }

    openWizard() {
        this.wizardModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        this.currentStep = 1;
        this.updateWizardUI();
    }

    closeWizard() {
        this.wizardModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    navigateWizard(direction) {
        if (direction === 'prev' && this.currentStep > 1) {
            this.currentStep--;
        } else if (direction === 'next' && this.currentStep < 4) {
            if (this.validateStep(this.currentStep)) {
                this.currentStep++;
            }
        }
        this.updateWizardUI();
    }

    validateStep(step) {
        switch(step) {
            case 1:
                if (!this.formData.businessGoal) {
                    alert('Seleziona un obiettivo di business');
                    return false;
                }
                if (this.formData.businessGoal === 'custom' && !this.customGoalInput.value.trim()) {
                    alert('Descrivi il tuo obiettivo personalizzato');
                    return false;
                }
                return true;
            case 2:
                if (this.formData.files.length === 0) {
                    alert('Carica almeno un file');
                    return false;
                }
                return true;
            case 3:
                if (!this.formData.modelSize || !this.formData.deploymentType) {
                    alert('Completa tutte le configurazioni del modello');
                    return false;
                }
                return true;
            default:
                return true;
        }
    }

    updateWizardUI() {
        // Update steps visibility
        this.wizardSteps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.getAttribute('data-step')) === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update progress bar
        this.progressSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update navigation buttons
        this.wizardPrevBtn.style.display = this.currentStep === 1 ? 'none' : 'block';
        this.wizardNextBtn.style.display = this.currentStep === 4 ? 'none' : 'block';
        this.wizardSubmitBtn.style.display = this.currentStep === 4 ? 'block' : 'none';
    }

    updateEstimates() {
        const estimates = this.calculateEstimates();
        this.trainingTime.textContent = estimates.time;
        this.estimatedCost.textContent = estimates.cost;
    }

    calculateEstimates() {
        const baseTime = {
            'tiny': '1-2 giorni',
            'small': '2-3 giorni',
            'medium': '3-5 giorni'
        };

        const baseCost = {
            'tiny': '€1,000 - €2,000',
            'small': '€2,000 - €3,000',
            'medium': '€3,000 - €5,000'
        };

        return {
            time: baseTime[this.formData.modelSize] || '2-3 giorni',
            cost: baseCost[this.formData.modelSize] || '€2,000 - €3,000'
        };
    }

    updateSummary() {
        if (this.requirementsSummary) {
            this.requirementsSummary.innerHTML = `
                <p><strong>Obiettivo:</strong> ${this.getBusinessGoalText()}</p>
                ${this.formData.customGoal ? `<p><strong>Obiettivo Custom:</strong> ${this.formData.customGoal}</p>` : ''}
                <p><strong>Volume Dati:</strong> ${this.getDataVolumeText()}</p>
            `;
        }

        if (this.configSummary) {
            this.configSummary.innerHTML = `
                <p><strong>Dimensione Modello:</strong> ${this.getModelSizeText()}</p>
                <p><strong>Tipo Deployment:</strong> ${this.getDeploymentTypeText()}</p>
                <p><strong>Priorità:</strong> ${this.getPriorityText()}</p>
            `;
        }

        if (this.costsSummary) {
            const estimates = this.calculateEstimates();
            this.costsSummary.innerHTML = `
                <p><strong>Tempo Stimato:</strong> ${estimates.time}</p>
                <p><strong>Costo Stimato:</strong> ${estimates.cost}</p>
            `;
        }
    }

    getBusinessGoalText() {
        const goals = {
            'text-generation': 'Generazione di Testo',
            'classification': 'Classificazione',
            'qa': 'Question Answering',
            'summarization': 'Summarization',
            'translation': 'Traduzione',
            'custom': 'Personalizzato'
        };
        return goals[this.formData.businessGoal] || 'Non selezionato';
    }

    getDataVolumeText() {
        const volumes = {
            'small': 'Piccolo (< 1GB)',
            'medium': 'Medio (1-10GB)',
            'large': 'Grande (> 10GB)'
        };
        return volumes[this.formData.dataVolume] || 'Non selezionato';
    }

    getModelSizeText() {
        const sizes = {
            'tiny': 'Tiny (< 1B parametri)',
            'small': 'Small (1-3B parametri)',
            'medium': 'Medium (3-7B parametri)'
        };
        return sizes[this.formData.modelSize] || 'Non selezionato';
    }

    getDeploymentTypeText() {
        const types = {
            'cloud': 'Cloud API',
            'local': 'Local Deployment',
            'edge': 'Edge Device'
        };
        return types[this.formData.deploymentType] || 'Non selezionato';
    }

    getPriorityText() {
        const priorities = {
            'speed': 'Velocità di Inferenza',
            'quality': 'Qualità dei Risultati',
            'balanced': 'Bilanciato'
        };
        return priorities[this.formData.priority] || 'Non selezionato';
    }

    async submitWizard() {
        // Here you would typically send the data to your backend
        console.log('Submitting form data:', this.formData);
        
        // Show success message
        alert('Grazie! Ti contatteremo presto per iniziare il processo di creazione del tuo modello AI.');
        
        // Close wizard
        this.closeWizard();
        
        // Reset form
        this.resetForm();
    }

    resetForm() {
        this.formData = {
            businessGoal: '',
            customGoal: '',
            dataVolume: '',
            dataType: '',
            files: [],
            modelSize: '',
            deploymentType: '',
            priority: '',
            selectedPlan: '',
            selectedUseCase: ''
        };
        
        // Reset all form elements
        this.businessGoalSelect.value = '';
        this.customGoalGroup.style.display = 'none';
        this.customGoalInput.value = '';
        this.dataVolumeSelect.value = '';
        this.dataTypeInputs.forEach(input => input.checked = false);
        this.modelSizeSelect.value = '';
        this.deploymentTypeSelect.value = '';
        this.inferenceSpeedSelect.value = '';
        
        // Reset file upload
        if (this.uploadedFiles) {
            this.uploadedFiles.innerHTML = '';
        }
        
        // Reset estimates
        this.updateEstimates();
        
        // Reset summary
        this.updateSummary();
    }

    initApp() {
        // Initialize any necessary third-party libraries or additional setup
        console.log('SLM Creator initialized successfully');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ModelCreatorApp();
});