var purplegene = {
    "yqlmashupbuilder": {
        "getNode": function(node) {
            var nodeExpr = node.tagName;
            if (nodeExpr == null) {
                return null;
            }
            nodeExpr = nodeExpr.toLowerCase();
            if (node.id != '') {
                nodeExpr += '[@id="' + node.id + '"]';
                return nodeExpr;
            }
            var rank = 1;
            var ps = node.previousSibling;
            while (ps != null) {
                if (ps.tagName == node.tagName) {
                    rank++;
                }
                ps = ps.previousSibling;
            }
            if (rank > 1) {
                nodeExpr += '[' + rank + ']';
            }
            else {
                var ns = node.nextSibling;
                while (ns != null) {
                    if (ns.tagName == node.tagName) {
                        nodeExpr += '[1]';
                        break;
                    }
                    ns = ns.nextSibling;
                }
            }
            return nodeExpr;
        },
        "getxpath": function() {
            var currentNode;
            if (window.getSelection != undefined) {
                currentNode = window.getSelection().anchorNode;
            }
            else {
                currentNode = document.selection.createRange().parentElement();
            }
            if (currentNode == null) {
                return '/html/body';
            }
            var path = [];
            while (currentNode != undefined) {
                var pe = this.getNode(currentNode);
                if ((currentNode.tagName != undefined) && (currentNode.tagName.toLowerCase() == 'tbody')) {
                    pe = null;
                }
                if (pe != null) {
                    path.push(pe);
                }
                currentNode = currentNode.parentNode;
            }
            var xpath = "/" + path.reverse().join('/');
            return xpath;
        }
    }
};
chrome.extension.onRequest.addListener(
function(request, sender, sendResponse) {
    sendResponse({
        "xpath": purplegene.yqlmashupbuilder.getxpath()
    })
});

