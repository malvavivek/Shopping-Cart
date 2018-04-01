var cart = {};
(function (cart) {
    cart.db = firebase.database().ref('productsInCart');
    cart.subtotal = 0;
    cart.estimatedtotal = 0;
    cart.totalQuantity = 0;
    cart.renderCart = function (snapshot) {

        cart.db.on('value', function (snapshot) {
            cart.snapshot = snapshot;
            cart.itemList = Object.keys(snapshot.val());
            cart.itemList.forEach((item) => {
                cart.itemContainer = $('#item').clone();
                cart.itemContainer.find('.itemVariation').html(snapshot.val()[item].p_variation);
                cart.itemContainer.find('.itemName').html(snapshot.val()[item].p_name);
                cart.itemContainer.find('.style').children().eq(0).html(snapshot.val()[item].p_style);
                cart.itemContainer.find('.colour').children().eq(0).html(snapshot.val()[item].p_selected_color.name);
                cart.itemContainer.find('.size').children().eq(0).html(snapshot.val()[item].p_selected_size.code);
                cart.itemContainer.find('.quantity').html(snapshot.val()[item].p_quantity);
                cart.itemContainer.find('.price').html(snapshot.val()[item].p_price * snapshot.val()[item].p_quantity);
                cart.itemContainer.find('.itemImage').prop('src', (snapshot.val()[item].p_img));
                cart.itemContainer.css('display', 'block');
                cart.itemContainer.find('.editBtn').on('click', function () {
                    $('#editModal').css('display', 'block');
                    $('.variationModal').html(snapshot.val()[item].p_variation);
                    $('.nameModal').html(snapshot.val()[item].p_name);
                    $('.modal-price').children().eq(0).html(snapshot.val()[item].p_originalprice);
                    $('.modalImgContainer').children().eq(0).prop('src', (snapshot.val()[item].p_img));
                    snapshot.val()[item].p_available_options.colors.forEach(function (color) {
                        var $label = $('<label>').prop('for', color.name);
                        var $input = $('<input type = "radio">').prop('id', color.name).prop('name', 'colors').prop('value', color.name).addClass('radio-buttons');
                        $input.css('background-color', color.hexcode);
                        if (color.name == snapshot.val()[item].p_selected_color.name) {
                            $input.prop('checked', true);
                        }
                        $label.appendTo($('#editModal').find('.modal-color-options'));
                        $input.appendTo($('#editModal').find('.modal-color-options'));
                    });
                    $('.sizedrp option').each(function () {
                        if ($(this).val() == snapshot.val()[item].p_selected_size.code)
                            $(this).attr('selected', true);
                    });
                    $('.qtyDrp option').each(function () {
                        if ($(this).val() == snapshot.val()[item].p_quantity)
                            $(this).attr('selected', true);
                    });

                    $('.cross-icon').on('click', function () {
                        $('#editModal').css('display', 'none');
                        $('#editModal').find('.modal-color-options').html('');
                    });
                    window.onclick = function(event) {
                        if (event.target == this.document.getElementById('editModal')) {
                            $('#editModal').css('display', 'none');
                            $('#editModal').find('.modal-color-options').html('');
                        }
                    }
                    $('.edit-modal-btn').on('click', function (e) {
                        firebase.database().ref('productsInCart/' + item).update({
                            p_quantity: $('.qtyDrp option:selected').val(),
                        });
                        firebase.database().ref('productsInCart/' + item + '/p_selected_size/').update({
                            code: $('.sizedrp option:selected').val(),
                        });
                        firebase.database().ref('productsInCart/' + item + '/p_selected_color/').update({
                            name: $('input[type=radio]:checked').val(),
                        });
                        $('#editModal').css('display', 'none');
                        window.location.reload();
                        $('editModal').find('.modal-color-options').html('');
                    });
                });

                cart.subtotal = cart.subtotal + snapshot.val()[item].p_price * snapshot.val()[item].p_quantity;
                cart.totalQuantity = cart.totalQuantity + parseInt(snapshot.val()[item].p_quantity);
                $('.checkout').before(cart.itemContainer);
                totalItems = parseInt(item) + 1;
                $('.itemNo').html(totalItems + ' Items');
            });
            $('.sub-amount').html(cart.subtotal);
            $('est-amount').html(cart.estimatedtotal);
            cart.discount();
        });

    }
    cart.discount = function () {
        var discount;
        if (cart.subtotal < 50) {
            $('.free-shipping').html("if you spend more than $50,you'll get free delivery");
        }
        if (cart.totalQuantity > 6) {
            discount = cart.subtotal * 0.25;
            $('.JF-applied').html('JF25 ');
        } else if (cart.totalQuantity > 3 && cart.totalQuantity <= 6) {
            discount = cart.subtotal * 0.25;
            $('.JF-applied').html('JF10 ');
        } else if (cart.totalQuantity === 3) {
            discount = cart.subtotal * 0.25;
            $('.JF-applied').html('JF05 ');
        }
        $('.discount-amt').html('-$' + (discount));
        $('.est-amount').html(cart.subtotal - discount);
    }
    $('.promotionBtn').on('click', function () {
        $('.JF-applied').html(' ' + $('.promotionField').val() + ' ');
    });
    $('#total-cost-price').html(cart.estimatedtotal);
    cart.renderCart();
})(cart);