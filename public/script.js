new Vue({
	el: '#app',
	data: {
		total: 0,
		items:[],
		cart:[],
		search:"",
		lastSearch: ""
	},
	methods: {
		onSubmit: function(){

			//clear previous search results
			this.items = [];

			//call to the imgur API
			this.$http
				.get('/search/'.concat(this.search))
				.then(function(res){
					this.items = res.data;
					this.lastSearch = this.search;
				})
		},
		addItem: function(addedItem) {
			//check if already in cart
			var itemIndex = _.findIndex(this.cart, o => addedItem.title == o.title);
			//doesnt exist, create qty key
			if(itemIndex == -1){
				addedItem.qty = 1;
				this.cart.push(addedItem);
			} else {
				// Add to total property
				this.cart[itemIndex].qty = ++this.cart[itemIndex].qty;
			};

			//Update the total
			this.total = _.reduce(this.cart, function(subTotal, cartItem){
				return subTotal + (cartItem.qty * cartItem.price);
			}, 0)
		},
		//edit cart qty using cart buttons
		inc: function(item){
			item.qty++;
			this.total += item.price;
		},
		dec: function(item){
			//sanity
			if(item.qty <=0) return;

			item.qty--;
			this.total -= item.price;

			//deal with the cart if its < 0
			if(item.qty <= 0){
				var itemIndex = _.findIndex(this.cart, c => c.title == item.title);
				this.cart.splice(itemIndex, 1);
			}
		}
	},
	filters:{
		currency: (price) => '$' + price.toFixed(2),
	}
});