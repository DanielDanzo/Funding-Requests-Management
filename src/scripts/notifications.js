function modal(notification){
    
    const modal = document.createElement('div');
    modal.id = 'myModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <p>${notification}</p>
        </div>
    `;
    document.body.appendChild(modal);

    const span = modal.getElementsByClassName('close')[0];

    modal.style.display = 'block';

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
};

export {modal};
