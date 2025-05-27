class ModelCreatorApp {
    constructor() {
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
        
        // Step buttons
        this.stepButtons = document.querySelectorAll('.step-button');
        
        // Modals
        this.demoModal = document.getElementById('demo-modal');
        this.wizardModal = document.getElementById('wizard-modal');
        this.closeModalBtns = document.querySelectorAll('.close-modal');
        
        // Wizard elements
        this.wizardSteps = document.querySelectorAll('.wizard-step');
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.wizardPrevBtn = document.getElementById('wizard-prev');
        this.wizardNextBtn = document.getElementById('wizard-next');
        this.wizardSubmitBtn = document.getElementById('wizard-submit');
        this.currentStep = 1;
        
        // Data upload elements
        this.dataOptions = document.querySelectorAll('input[name="data-source"]');
        this.uploadContainer = document.getElementById('upload-container');
        this.dropzone = document.querySelector('.dropzone');
        this.fileInput = document.getElementById('file-upload');
        this.uploadedFiles = document.querySelector('.uploaded-files');
        
        // Final CTA
        this.finalCta = document.getElementById('final-cta');
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
                this.setActiveNavLink(link);
            });
        });
        
        // Hero buttons
        if (this.startNowBtn) {
            this.startNowBtn.addEventListener('click', () => this.openWizard());
        }
        
        if (this.viewDemoBtn) {
            this.viewDemoBtn.addEventListener('click', () => this.openModal(this.demoModal));
        }
        
        // Step buttons
        this.stepButtons.forEach(button => {
            button.addEventListener('click', () => {
                const step = parseInt(button.getAttribute('data-step'));
                this.openWizard(step);
            });
        });
        
        // Close modal buttons
        this.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal);
            });
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
        
        // Data upload handling
        this.dataOptions.forEach(option => {
            option.addEventListener('change', () => this.toggleDataOption());
        });
        
        if (this.dropzone) {
            this.dropzone.addEventListener('click', () => this.fileInput.click());
            this.dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.dropzone.classList.add('dragover');
            });
            this.dropzone.addEventListener('dragleave', () => {
                this.dropzone.classList.remove('dragover');
            });
            this.dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                this.dropzone.classList.remove('dragover');
                this.handleFileUpload(e.dataTransfer.files);
            });
        }
        
        if (this.fileInput) {
            this.fileInput.addEventListener('change', () => {
                this.handleFileUpload(this.fileInput.files);
            });
        }
        
        // Final CTA
        if (this.finalCta) {
            this.finalCta.addEventListener('click', () => this.openWizard());
        }
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
    }

    setActiveNavLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    openModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    openWizard(step = 1) {
        this.currentStep = step;
        this.updateWizardUI();
        this.openModal(this.wizardModal);
    }

    navigateWizard(direction) {
        if (direction === 'next') {
            if (this.validateStep(this.currentStep)) {
                this.currentStep++;
            } else {
                return; // Don't proceed if validation fails
            }
        } else if (direction === 'prev') {
            this.currentStep--;
        }
        
        this.updateWizardUI();
    }

    validateStep(step) {
        // Basic validation for each step
        switch(step) {
            case 1:
                const businessGoal = document.getElementById('business-goal');
                const industry = document.getElementById('industry');
                if (businessGoal && businessGoal.value === '') {
                    alert('Per favore seleziona un obiettivo aziendale');
                    return false;
                }
                if (industry && industry.value === '') {
                    alert('Per favore seleziona un settore');
                    return false;
                }
                return true;
            case 2:
                const dataSource = document.querySelector('input[name="data-source"]:checked');
                if (!dataSource) {
                    alert('Per favore seleziona un'opzione per i dati');
                    return false;
                }
                return true;
            case 3:
                const modelSize = document.getElementById('model-size');
                const deployment = document.getElementById('deployment');
                if (modelSize && modelSize.value === '') {
                    alert('Per favore seleziona una dimensione del modello');
                    return false;
                }
                if (deployment && deployment.value === '') {
                    alert('Per favore seleziona un ambiente di deployment');
                    return false;
                }
                return true;
            case 4:
                const termsCheckbox = document.getElementById('terms-checkbox');
                if (termsCheckbox && !termsCheckbox.checked) {
                    alert('Per favore accetta i termini di servizio');
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
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.toggle('active', stepNum === this.currentStep);
        });
        
        // Update progress indicators
        this.progressSteps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.toggle('active', stepNum <= this.currentStep);
        });
        
        // Update buttons
        if (this.wizardPrevBtn) {
            this.wizardPrevBtn.disabled = this.currentStep === 1;
        }
        
        if (this.wizardNextBtn && this.wizardSubmitBtn) {
            if (this.currentStep === this.wizardSteps.length) {
                this.wizardNextBtn.style.display = 'none';
                this.wizardSubmitBtn.style.display = 'block';
                this.updateSummary();
            } else {
                this.wizardNextBtn.style.display = 'block';
                this.wizardSubmitBtn.style.display = 'none';
            }
        }
    }

    toggleDataOption() {
        const selectedOption = document.querySelector('input[name="data-source"]:checked');
        if (selectedOption && selectedOption.value === 'upload') {
            this.uploadContainer.style.display = 'block';
        } else {
            this.uploadContainer.style.display = 'none';
        }
    }

    handleFileUpload(files) {
        if (!files || files.length === 0) return;
        
        this.uploadedFiles.innerHTML = '';
        
        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileIcon = document.createElement('i');
            fileIcon.className = 'fas fa-file';
            
            const fileName = document.createElement('span');
            fileName.textContent = file.name;
            
            const fileSize = document.createElement('span');
            fileSize.className = 'file-size';
            fileSize.textContent = this.formatFileSize(file.size);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-file';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', () => fileItem.remove());
            
            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileName);
            fileItem.appendChild(fileSize);
            fileItem.appendChild(removeBtn);
            
            this.uploadedFiles.appendChild(fileItem);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    updateSummary() {
        // Update summary information based on user selections
        const businessGoal = document.getElementById('business-goal');
        const industry = document.getElementById('industry');
        
        const summaryGoal = document.getElementById('summary-goal');
        const summaryIndustry = document.getElementById('summary-industry');
        
        if (businessGoal && summaryGoal) {
            const selectedGoal = businessGoal.options[businessGoal.selectedIndex];
            summaryGoal.textContent = selectedGoal ? selectedGoal.text : '';
        }
        
        if (industry && summaryIndustry) {
            const selectedIndustry = industry.options[industry.selectedIndex];
            summaryIndustry.textContent = selectedIndustry ? selectedIndustry.text : '';
        }
    }

    submitWizard() {
        if (this.validateStep(this.currentStep)) {
            alert('Grazie per aver completato il wizard! Ti contatteremo presto.');
            this.closeModal(this.wizardModal);
        }
    }

    initApp() {
        // Set first nav link as active by default
        if (this.navLinks.length > 0) {
            this.setActiveNavLink(this.navLinks[0]);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ModelCreatorApp();
});