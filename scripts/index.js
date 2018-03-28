var cart = {};
(function (cart) {
    var editButton = document.getElementById('editButton');
    var edtModal = document.getElementById('editModal');
    var addButton = document.getElementById('checkoutButton');
    
    editButton.addEventListener('click', function () {
        edtModal.style.display = "block";
    });
    window.addEventListener('click', function (event) {
        if (event.target == edtModal) {
            edtModal.style.display = "none";
        } else if (event.target == addModal) {
            addModal.style.display = "none";
        }
    });
    addButton.addEventListener('click', function () {
        addModal.style.display = "block";
    });
    cart.db = firebase.database().ref('productsInCart');

    cart.subtotal = 0;
    cart.estimatedtotal = 0;
    cart.renderCart = function (snapshot) {

        cart.db.on('value', function (snapshot) {
            cart.snapshot = snapshot;
            cart.itemList = Object.keys(snapshot.val());
            //console.log(itemList);
            cart.itemList.forEach((item) => {
                cart.itemContainer = $('#item').clone();
                cart.itemContainer.find('.itemVariation').html(snapshot.val()[item].p_variation);
                cart.itemContainer.find('.itemName').html(snapshot.val()[item].p_name);
                cart.itemContainer.find('.style').children().eq(0).html(snapshot.val()[item].p_style);
                cart.itemContainer.find('.colour').children().eq(0).html(snapshot.val()[item].p_selected_color.name);
                cart.itemContainer.find('.size').children().eq(0).html(snapshot.val()[item].p_selected_size.name);
                cart.itemContainer.find('.quantity').html(snapshot.val()[item].p_quantity);
                cart.itemContainer.find('.price').html(snapshot.val()[item].p_originalprice);
                cart.itemContainer.find('.itemImage').attr('src',(snapshot.val()[item].p_img));
                cart.itemContainer.css('display','block');
                $('.editBtn').on('click',function(){
                    var addModal = document.getElementById('addModal');
                    $('addModal').css('display','block');
                });
                $('.checkout').before(cart.itemContainer);
            });
        });

    }
    cart.renderCart();


})(cart);