import shortId from 'shortid'
import urlModel from '../model/urlModel.js'
import httpErr from 'http-errors'

export const createUrl = async (req, res, next) => {
    try {
        const { url } = req.body

        const isValidUrl = (u) => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/.test(u);

        if (!url)
            throw httpErr.BadRequest('Enter url')
        
        if (!isValidUrl(url))
            throw httpErr.BadRequest('Enter a valid url')

        const urlExists = await urlModel.findOne({ longUrl: url });

        if (urlExists) {
            res.render('index', {
                // short_url: `${req.hostname}/${urlExists.shortId}`,
                short_url: `${req.headers.host}/${urlExists.urlCode}`,
            })
            return
        }

        const urlCode = shortId.generate();
        const shortUrl = `${req.headers.host}/${urlCode}`

        const savedData = {
            urlCode: urlCode,
            longUrl: url.trim(),
            shortUrl: shortUrl
        }
        await urlModel.create(savedData);

        res.render('index', {
            // short_url: `${req.hostname}/${urlExists.shortId}`,
            short_url: `${req.headers.host}/${urlCode}`,
        })

    } catch (err) {
        next(err)
    }
};

export const getUrl = async (req, res, next) => {
    try {
        const url = await urlModel.findOne({
            urlCode: req.params.urlCode
        });

        if (!url)
            return res.status(404).json({ message: "No url found" });

        return res.status(302).redirect(url.longUrl);

    } catch (err) {
        next(err)
    }
};

