(function($){


    var JPrice = function(elem, options){
    
        this.assets = {
            priceTag: '<span class="price-tag-wrapper"> - <span class="price-tag"></span></span>',
            sidebar: {
                total: '<div class="total well"><h3 style="margin-top: 0px; margin-bottom: 0px;">Total: <span class="price"></span></h3></div>',
                summary: '<div class="summary well"><h3 style="margin-top: 0px">Summary:</h3><div class="itemized-summary"/></div>',
                config: '<div class="config well"/>'
            }
        }
    
        this.elem = elem;
        this.init(options);
        
    };
    
    JPrice.prototype = {
    
        version: "1.5.2",
    
        init: function(options){
            
            var self = this;
            
            self.events = {};
        
            //extend the default options with the ones supplied
            self.options = $.extend({}, $.fn.jPrice.defaults, options);
            
            //add the sidebar
            self.addSidebar();
            
            //get all inputs in the form
            self.inputs = self.getInputs();
            
            //add price tags
            self.addPriceTags();
            
            self.initializeSpecialElements();
            
            //setup hidden input
            self.addHiddenTotal();
            
            //setup prices over certain periods
            self.setupPricesOverPeriod();
            
            //bind the necessary events
            self.bindEvents();
            
            //add user configurable stuff
            self.addUserConfig();
            
            //run the on change events
            self.onChange();
        },
        
        trigger: function(event, data){
            if(!this.events[event]){
                return;
            }
            var self = this;
            var eventObj = {
                type: event,
                data: data
            };
            $.each(this.events[event], function(index, fn){
                fn.call(self, eventObj);
            });
        },
        
        on: function(event, fn){
            this.events[event] = this.events[event] || [];
            this.events[event].push(fn);
        },
        
        initializeSpecialElements: function(){
            var self = this;
            
            this.getQuantityElements().each(function(index){
                var input = $(this);
                var cfg = {
                    min: 1,
                    value: input.val(),
                    step: 1
                }
                self.instantiateSpinner(input, cfg);
            });
            
            this.inputs.filter('[data-slider], [data-spinner]').each(function(index){
                    
                var input = $(this);
            
                var attrs = ['min', 'max', 'step', 'value'];
            
                var cfg = {};
            
                if(typeof table !== 'undefined'){
                    table = table.replace(/\\n/g, ',');
                    tmp = table.split(',');
                    table = {};
                    $.each(tmp, function(key, value){
                        tmp2 = value.split(':');
                        table['v'+tmp2[0]] = tmp2[1];
                    });
                }
            
                $.each(attrs, function(key, value){
                    cfg[value] = parseFloat(input.attr(value), 10);
                });
                
                if(input.is('[data-slider]')){
            
                    //input.data('value-table', '1:1,2:4,3:9,4:16,5:25,6:36,7:49,8:64,9:81,10:100');
            
                    var table = input.data('value-table');
            
                    var slider = $('<div class=\"slider\"/>');
            
                    slider.insertBefore(input);
                    
                    if(typeof table !== 'undefined'){
                        
                    }
            
                    cfg.slide = function(event, ui){
                        var value = ui.value;
                        if(typeof table !== 'undefined'){
                            //use table to calculate value
                            value = table['v'+value];
                        }
                        input.val(value).trigger('change');
                    };
            
                    slider.slider(cfg);
                    
                    if(typeof table !== 'undefined'){
                        input.val(table['v'+cfg.value]);
                    }
                    
                    input.on('change click', function(event){
                        slider.slider('value', input.val());
                    });
                    
                    input.removeAttr('data-slider');
                    self.instantiateSpinner(input, cfg);
                
                } else {
                    self.instantiateSpinner(input, cfg);
                }
                
            });
        },
        
        instantiateSpinner: function(input, cfg){
            input.removeAttr('data-spinner');
            if($.browser.webkit){
                return;
            }
            if(typeof input.spinner === 'function'){
                input.prop('type', 'text');
                input.spinner(cfg);
            }
        },
        
        setupPricesOverPeriod: function(){
            var prices = this.options.pricesOverPeriod;
            if(!prices.length){
                return;
            }
            
            var self = this;
            var totalDiv = this.sidebar_elem.children('.total');
            $.map(prices, function(value, index){
                var html = '<p><strong>' + value.title + ': </strong><span class="price-over">' + '</span></p>';
                value.elem = $(html);
                value.priceElem = value.elem.find('.price-over');
                
                if(value.divider){
                    value.multiplier = 1/value.divider;
                }
                
                value.elem.appendTo(totalDiv);
                
                return value;
            });
            
            this.on('change', function(event){
                var total = event.data.total;
                $.each(prices, function(index, value){
                    var text = self.formatPrice(total * value.multiplier) + value.suffix;
                    value.priceElem.text(text);
                });
            });
            
        },
        
        addHiddenTotal: function(){
            var self = this;
            var hiddenTotal = $('<input type="hidden" id="total-cost" name="total-cost" />');
            hiddenTotal.appendTo(this.sidebar_elem.children('.total'));
            this.on('change', function(event){
                var total = event.data.total;
                hiddenTotal.val(total);
            });
        },
        
        bindEvents: function(){
            var self = this;
            //listen for an input change
            var changeFn = function(){
                self.onChange();
            };
            self.elem.on('change', 'input, select', changeFn);
            self.elem.on('click', 'input[type="number"]', changeFn);
        },
        
        addPriceTags: function(){
            var self = this;

            this.elem.find('span.staticPrice').remove();
            
            //add price tags to each element
            self.inputs.each(function(index, value){
                var elem = $(this);
                if(elem.is('[data-cost]') || elem.is('select:has([data-cost])')){
                    self.addPriceTag(elem);
                }
            });
        },
        
        addUserConfig: function(){
            var opts = this.options;
            var elems = $();
            var self = this;
            
            
            
            var priceTags = self.getAllPriceTags();
            priceTags.fadeTo(0, opts.showPrices ? 1 : 0);
            
            // ----
            
            var configElem = this.sidebar_elem.children('.config');
            
            if(elems.length === 0){
                //remove the config sidebar
                configElem.remove();
            } else {
                configElem.append(elems);
            }
        },
        
        getAllPriceTags: function(){
            return this.options_elem.find('.price-tag-wrapper');
        },
        
        onChange: function(){
        
            //get all inputs in the form
            this.inputs = this.getInputs();
            
            this.updatePriceTags();
        
            var total = this.calculateTotal();
            var formattedTotal = this.formatPrice(total);
            this.sidebar_elem.children('.total').find('.price').text(formattedTotal);
            
            var summary = this.getItemizedSummary();
            var renderedSummary = this.renderItemizedSummary(summary);
            
            this.sidebar_elem.find('.itemized-summary').html(renderedSummary);
            
            var data = {
                total: total,
                formattedTotal: formattedTotal
            };
            this.trigger('change', data);
            
        },
        
        updatePriceTags: function(){
            var self = this;
            this.inputs.each(function(index){
                var input = $(this);
                var ptElem = input.data('price-tag');
                if(ptElem){
                    var price = self.getPrice(input);
                    if(price === 0){
                        var zero = self.options.showZeroAs;
                        if(!zero || zero === 'false'){
                            price = '';
                        } else {
                            price = zero;
                        }
                    }
                    if(price){
                        if(!isNaN(price)){
                            price = self.formatPrice(price);
                        }
                        ptElem.show();
                    } else {
                        ptElem.hide();
                    }
                    ptElem.find('.price-tag').text(price);
                }
            });
        },
        
        getInputs: function(){
            var inputs = this.options_elem.find(':input');
            
            //filter out any inputs that need to be ignored
            inputs = inputs.not('[data-ignore]');
            
            //filter out any submit buttons
            inputs = inputs.not(':submit');
            
            return inputs;
        },
        
        getItemizedSummary: function(){
            var self = this;
            var summary = {
            
            };
            this.getSelectedElements().not('textarea').each(function(index){
                var input = $(this);
                var name = input.attr('name');
                
                if(typeof summary[name] === 'undefined'){
                    summary[name] = [];
                }
                
                var value = self.getInputValue(input);
                
                if(value){
                    if($.isArray(value)){
                        $.merge(summary[name], value);
                    } else {
                        summary[name].push(value);
                    }
                }
            });
            
            return summary;
        },
        
        renderItemizedSummary: function(summary){
            var html = [];
            var self = this;
            
            var divider = '<hr/>';
            
            $.each(summary, function(index, value){
            
                var elem = $('#' + index);
                var isQuantity = elem.is('[data-quantity]');
            
                var title = self.options.items[index];
                if(!title){
                    return true;
                }
                var fragment = '<p><strong>' + title + ': </strong>';
                
                if(value.length === 0){
                    return true;
                } else if(value.length === 1){
                    fragment += value[0];
                } else {
                    fragment += '<ul><li>' + value.join('</li><li>') + '</li></ul>';
                }
                
                fragment += '</p>';
                
                if(isQuantity){
                    fragment = '<div class="quantity">' + fragment + '</div>';
                } else {
                    fragment = '<div class="line-item">' + fragment + '</div>';                    
                }
            
                html.push(fragment);
                
                if(isQuantity){
                    html.push(divider);
                }
            });
            
            if(html.length === 0){
                html = [self.options.emptySummaryText];
            }
            
            if(html[html.length-1] === divider){
                html.pop();
            }
            
            return html.join("\n");  
        },
        
        formatPrice: function(price){
            return this.options.signBefore + price.toFixed(2) + this.options.signAfter;
        },
        
        addPriceTag: function(elem){
            var priceTag = $(this.assets.priceTag);
            
            var price = this.getPrice(elem);
            var formattedPrice = this.formatPrice(price);
            
            priceTag.find('.price-tag').text(formattedPrice);
            
            priceTag.appendTo(elem.parent());
            
            elem.data('price-tag', priceTag);   
        },
        
        getInputValue: function(elem){
            var val = elem.val();
            if(elem.is(':file')){
                var tmp = val.split('\\');
                return tmp[tmp.length-1];
            }
            
            return val;
        },
        
        getInputLabel: function(elem){
            if(elem.is('[data-label]')){
                return elem.data('label');
            }
            
            return elem.parent().find('.input-label').text();
            
        },
        
        getPrice: function(elem){
            var isSelect = elem.is('select');
            if(isSelect){
                elem = elem.find(':selected');
            }
            var totalPrice = 0;
            elem.each(function(index){
                var input = $(this);
                var price = parseFloat(input.data('cost') || 0, 10);
                if(isNaN(price)){
                    price = 0;
                }
                var type = input.attr('type') || '';
                if(type.match(/text|number/)){
                    price *= (parseFloat(input.val(), 10) || 0);
                }
                totalPrice += price;    
            });
            return totalPrice;
        },
        
        addSidebar: function(){
        
            var self = this;
            var sidebar = $('<div class="sidebar"/>');
            
            if(!this.options.itemize){
                delete this.assets.sidebar.summary;
            }
            
            $.each(this.assets.sidebar, function(index, value){
                sidebar.append(value);
            });
            
            this.elem.wrapInner('<div class="options"/>');
            this.options_elem = this.elem.children('.options');
            
            this.elem.append(sidebar);
            
            this.sidebar_elem = sidebar;
            
            this.elem.addClass(this.options.subAlign);
            
            this.setOptionsWidth();
            
            $(window).resize(function(event){
                self.setOptionsWidth();
            });
            
            this.floatSidebar();
        },
        
        floatSidebar: function(){
            if(!this.options.floatSub || !this.options.subAlign.match(/left|right/)){
                return;
            }
            
            var self = this;
            var elem = this.sidebar_elem;
            var $window = $(window);
            var $html = $('html');
            
            var floatMargin = 20;
            
            //get the initial offset
            var initialOffset = elem.offset();
            var offset = $.extend({}, initialOffset);
            
            //get the parent
            var parent = elem.parent();
            var parentWidth = parent.width();
            var parentLeft = parent.offset().left;
            
            $window.on('resize', function(event){
                var diff1 = parent.width() - parentWidth;
                var diff2 = parent.offset().left - parentLeft;
                offset.left = initialOffset.left + diff1 + diff2;
                $window.trigger('scroll');
            });
            
            $window.on('scroll', function(event){
                var scrollTop = $window.scrollTop();
                var diff = scrollTop - initialOffset.top;
                var elemHeight = elem.outerHeight();
                var parentHeight = parent.height();

                var maxOffset = parentHeight - elemHeight - floatMargin;

                if(diff > -floatMargin){
                    if(diff < maxOffset - floatMargin){
                        elem.removeClass('bottom');
                        elem.addClass('fixed');
                        elem.css({
                            'left': offset.left,
                            'top': floatMargin + 'px'
                        });
                    } else {
                        elem.addClass('bottom');
                        elem.removeClass('fixed');
                        elem.css({
                            'top': maxOffset + 'px',
                            'left': 0
                        });
                    }
                } else {
                    elem.removeClass('fixed bottom');
                    elem.css({
                        'top': 0,
                        'left': 0
                    });
                }
            });
        },
        
        setOptionsWidth: function(){
            var formWidth = this.elem.outerWidth();
            var sidebarWidth = this.sidebar_elem.outerWidth();
            var optionsWidth = formWidth - sidebarWidth - 21;
            
            this.options_elem.width(optionsWidth);
        },
        
        calculateTotal: function(){
            var total = 0;
            var self = this;
            
            var selectedElems = this.getSelectedElements();
            total = self.calculateTotalFor(selectedElems);
            
            var quantityElems = this.getQuantityElements();
            quantityElems.each(function(index){
                var elem = $(this);
                var quantity = parseFloat(elem.val() || 1, 10);
                
                if(quantity === 1){
                    return true;
                }                
                
                var fields = elem.attr('data-quantity').split(',');
                fields = $.map(fields, function(value, index){
                    value = value.replace('[', '\\[');
                    value = value.replace(']', '\\]');
                    return '#' + value + ',[name="' + value + '"]';
                }).join(',');
                
                var elems = selectedElems.filter(fields);
                var subTotal = self.calculateTotalFor(elems);
                total += (quantity - 1) * subTotal;
            });
            
            return total;
        },
        
        calculateTotalFor: function(elems){
            var self = this;
            var subTotal = 0;
            
            elems.each(function(index){
                var input = $(this);
                subTotal += self.getPrice(input);
            });
            
            return subTotal;
        },
        
        getQuantityElements: function(){
            return this.options_elem.find(':input[data-quantity]');
        },
        
        getSelectedElements: function(){
            var selected = $();
            var self = this;
            this.inputs.each(function(index){
                var input = $(this);
                
                if(self.canInputBeChecked(input)){
                    if(!input.is(':checked')){
                        //continue
                        return true;
                    }
                }
                
                selected = selected.add(input);
            });
            
            return selected;
        },
        
        canInputBeChecked: function(elem){
            return (elem.is(':radio') || elem.is(':checkbox'));
        }
    
    };
    
    $.fn.jPrice = function(options) {
    	return this.each(function(){
    		var elem = $(this);
    		
    		if (elem.data('jprice')){ return };
    		
    		var jPrice = new JPrice(elem, options);
    		
    		elem.data('jprice', jPrice);
    	});
    };
    
    $.fn.bPrice = $.fn.jPrice;
    
    $.fn.jPrice.defaults = {
        floatSub: false,
        subSelector: '',
        subAlign: 'right',
        showPrices: true,
        showPricesOption: true,
        showZeroAs: '',
        signBefore: '$',
        signAfter: ' AUD',
        pricesFadeTime: 600,
        itemize: false,
        items: [],
        decimalSep: '.',
        thousandsSep: ',',
        emptySummaryText: '<p>Please configure your order...</p>',
        pricesOverPeriod: []
    };


})(jQuery);