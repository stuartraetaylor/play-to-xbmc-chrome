
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "getVideoSrc") {
            var videoSrc = findVideoSrc();
            sendResponse({videoSrc: videoSrc});
        } else if (request.action == "onPlayback") {
            var $video = $('#player video:first');
            $video[0].pause();
        }
    }
);

function findVideoSrc() {
    var playerSrc = getByPlayerSrc();
    if (playerSrc)
        return playerSrc;

    var pcPlatformSrc = getByPCPlatform();
    if (pcPlatformSrc)
        return pcPlatformSrc;

    var tvPlatformSrc = getByTVPlatform();
    if (tvPlatformSrc)
        return tvPlatformSrc;

    return "";
}

function getByPlayerSrc() {
    var $video = $('#player video:first');
    return $video.find('source:first').attr('src');
}

function getByPCPlatform() {
    try {
        // Get obfuscated URL script.
        var content = $('#player').find('script:first')[0].innerHTML;
        content = content.replace(/(loadScriptUniqueId[\s\S]*?$)/, "");

        // And then evaluate it.
        eval(content);
        if (typeof quality_1080p !== 'undefined' && quality_1080p)
            return quality_1080p;
        if (typeof quality_720p !== 'undefined' && quality_720p)
            return quality_720p;
        if (typeof quality_480p !== 'undefined' && quality_480p)
            return quality_480p;
        if (typeof quality_360p !== 'undefined' && quality_360p)
            return quality_360p;

        return "";
    } catch (e) {
        return "";
    }
}

function getByTVPlatform() {
    try {
        var content = $('body')[0].innerHTML;

        // Find the script block.
        var pattern = /<\/h1>\s*<script[^>]*>([\s\S]*?)<\/script>/;
        var matches = content.match(pattern);
        var script = matches[1];

        // Evaluate it.
        eval(script);
        return mediastring;
    } catch (e) {
        return "";
    }
}
