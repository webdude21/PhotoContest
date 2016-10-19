var cloudinary = require('cloudinary'),
  data = require('../data'),
  env = require('../config/global-variables'),
  globalConstants = require('../config/global-constants'),
  CONTROLLER_NAME = 'admin',
  errorHandler = require('../utilities/error-handler'),
  ACCESS_TOKEN = `${env.FACEBOOK_APP_ID}|${env.FACEBOOK_APP_SECRET}`,
  COULD_NOT_RESET_APP = 'Could not reset the application!',
  RESET_BODY = 'Това ще изтрие цялата информация в приложението (потребители, участници,' +
  ' снимки и гласове) с изключение на администраторските акаунти';

cloudinary.config(env.CLOUDINARY_URL);

module.exports = {
  getById: function (req, res) {
    data.contestantsService
      .getBy(req.params.id)
      .then(contestant => res.render(`${CONTROLLER_NAME}/contestants/contestant`, { contestant }),
        () => errorHandler.redirectToNotFound(res));
  },
  toggleApprovalById: function (req, res) {
    data.contestantsService
      .getBy(req.params.id)
      .then(contestant => {
        contestant.approved = !contestant.approved;
        contestant.save();
        res.redirect(`/${CONTROLLER_NAME}/contestants/${contestant.id}`);
      }, () => errorHandler.redirectToNotFound(res));
  },
  getEditTos: function (req, res) {
    data.pageService
      .getFirstPage()
      .then(page => res.render(`${CONTROLLER_NAME}/edit-tos`, page),
        () => errorHandler.redirectToNotFound(res));
  },
  postEditTos: function (req, res) {
    data.pageService
      .getFirstPage()
      .then((page) => {
        page.title = req.body.title;
        page.content = req.body.content;
        page.save();
        req.session.successMessage = 'Променихте общите условия успешно!';
        res.redirect('/');
      }, () => errorHandler.redirectToNotFound(res));
  },
  getResetContest: (req, res) => res.render('confirm', {
    message: {
      title: 'Рестартиране на конкурса',
      body: RESET_BODY,
      buttonText: 'Рестарт'
    }
  }),
  getResetApplication: (req, res) => res.render('confirm', {
    message: {
      title: 'Рестартиране на приложението',
      body: RESET_BODY,
      buttonText: 'Рестарт'
    }
  }),
  postResetApplication: function (req, res) {
    data.contestantsService
      .deleteAll()
      .then(() => data.users.deleteAllNonAdmins())
      .then(() => cloudinary.api.delete_all_resources(() => res.redirect('/')))
      .catch(err => errorHandler.redirectToError(req, res, COULD_NOT_RESET_APP + err));
  },
  postResetContest: function (req, res) {
    data.contestantsService
      .deleteAll()
      .then(() => cloudinary.api
        .delete_resources_by_prefix(globalConstants.CLOUDINARY_CONTESTANTS_FOLDER_NAME,
          () => res.redirect('/')),
        err => errorHandler.redirectToError(req, res, 'Could not reset the contest!' + err));
  },
  getAllContestants: function (req, res) {
    data.contestantsService
      .getAdminQuery(err => errorHandler.redirectToError(req, res, 'Could not get all contestants!' + err),
        contestants => {
          contestants.data.forEach(contestant => contestant.pictures.forEach(picture => {
            picture.url = cloudinary.url(picture.serviceId, { transformation: 'thumbnail', secure: true });
          }));
          res.render(`${CONTROLLER_NAME}/contestants/all`, contestants);
        }, req.query, globalConstants.PAGE_SIZE);
  },
  getAllContestantsAsList: function (req, res) {
    data.contestantsService
      .getAdminQuery(err => errorHandler.redirectToError(req, res, 'Could not get all contestants!' + err),
        contestants => res.render(`${CONTROLLER_NAME}/contestants/all-list`, { contestants, ACCESS_TOKEN }),
        req.query);
  },
  getAllRegisteredUsers: function (req, res) {
    data.userService
      .getAll()
      .then(users => res.render(`${CONTROLLER_NAME}/users/all`, { users: users }),
        err => errorHandler.redirectToError(req, res, 'Could not load registered users' + err));
  },
  getRegisteredUserById: function (req, res) {
    var result = {
      user: {},
      contestants: []
    };

    data.userService
      .getBy(req.params.id)
      .then(user => {
        result.user = user;
        return data.contestantsService.getAllContestantsByUser(user);
      })
      .then(contestants => {
        result.contestants = contestants;
        res.render(`${CONTROLLER_NAME}/users/detail`, result);
      })
      .catch(err => errorHandler.redirectToError(req, res, 'Could not load registered user info' + err));
  }
};
