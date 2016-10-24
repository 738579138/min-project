$.extend($.fn.combo.methods, {
    /**
     * ����combo�ı���
     * @param {Object} jq
     * @param {Object} param stopArrowFocus:�Ƿ���ֹ���������ťʱfoucs�ı���
     * stoptype:�������ͣ�����disable��readOnly���ַ�ʽ
     */
    disableTextbox : function(jq, param) {
        return jq.each(function() {
            param = param || {};
            var textbox = $(this).combo("textbox");
            var that = this;
            var panel = $(this).combo("panel");
            var data = $(this).data('combo');
            if (param.stopArrowFocus) {
                data.stopArrowFocus = param.stopArrowFocus;
                var arrowbox = $.data(this, 'combo').combo.find('span.combo-arrow');
                arrowbox.unbind('click.combo').bind('click.combo', function() {
                    if (panel.is(":visible")) {
                        $(that).combo('hidePanel');
                    } else {
                        $("div.combo-panel").panel("close");
                        $(that).combo('showPanel');
                    }
                });
                textbox.unbind('mousedown.mycombo').bind('mousedown.mycombo', function(e) {
                    e.preventDefault();
                });
            }
            textbox.prop(param.stoptype?param.stoptype:'disabled', true);
            data.stoptype = param.stoptype?param.stoptype:'disabled';
        });
    },
    /**
     * ��ԭ�ı���
     * @param {Object} jq
     */
    enableTextbox : function(jq) {
        return jq.each(function() {
            var textbox = $(this).combo("textbox");
            var data = $(this).data('combo');
            if (data.stopArrowFocus) {
                var that = this;
                var panel = $(this).combo("panel");
                var arrowbox = $.data(this, 'combo').combo.find('span.combo-arrow');
                arrowbox.unbind('click.combo').bind('click.combo', function() {
                    if (panel.is(":visible")) {
                        $(that).combo('hidePanel');
                    } else {
                        $("div.combo-panel").panel("close");
                        $(that).combo('showPanel');
                    }
                    textbox.focus();
                });
                textbox.unbind('mousedown.mycombo');
                data.stopArrowFocus = null;
            }
            textbox.prop(data.stoptype, false);
            data.stoptype = null;
        });
    }
});



$.extend($.fn.combo.methods, {
    /**
     * �������ı���Ҳ��ʾ�������Ĺ���
     * @param {Object} jq
     */
    activeTextArrow : function(jq) {
        return jq.each(function() {
            var textbox = $(this).combo("textbox");
            var that = this;
            var panel = $(this).combo("panel");
            textbox.bind('click.mycombo', function() {
                if (panel.is(":visible")) {
                    $(that).combo('hidePanel');
                } else {
                    $("div.combo-panel").panel("close");
                    $(that).combo('showPanel');
                }
            });
        });
    },
    /**
     * ȡ������ı���Ҳ��ʾ�������Ĺ���
     * @param {Object} jq
     */
    inactiveTextArrow : function(jq) {
        return jq.each(function() {
            var textbox = $(this).combo("textbox");
            textbox.unbind('click.mycombo');
        });
    }
});
