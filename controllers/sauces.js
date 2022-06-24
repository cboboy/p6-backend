const Sauces = require('../models/Sauces');
const fs = require('fs');

/**
 * recuperer toutes les sauces
 */
exports.loadLesSauces = (req, res, next) => {
  Sauces.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

/**
 * recuperer une sauce
 */
exports.loadLaSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

/**
 * creer sauce
 */
exports.saveSauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauces({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({error}));
};

/**
 * Modifier une sauce 
 */
exports.updateSauces = (req, res, next) => {
  if (req.file) {
    Sauces.findOne({ _id: req.params.id}).then(
      (sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => { 
          Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(400).json({ error }));
        let sauceObject = JSON.parse(req.body.sauce);
        sauceObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    // Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    // .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    // .catch(error => res.status(400).json({ error }));
  } else {
    Sauces.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(500).json({error}));
  }    
};
;

/**
 * supprimer une sauce
 */
exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id}).then(
    (sauce) => {
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ error: 'Requête non autorisée !' });
      }
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({error}));
};

/**
 * gestion likes
 */
exports.likeSauces = (req, res, next) => {
  ;
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;
  switch(like) {
    case 1:
      Sauces.updateOne({ _id: sauceId }, { $inc: { likes: +1 }, $push: { usersLiked: userId } }) 
      .then(() => res.status(200).json({ message: 'Like ok !'}))
      .catch((error) => res.status(400).json({ error }));
      break;
    case 0:
      Sauces.findOne({ _id: sauceId}).then(
        (sauce) => {
          if(sauce.usersLiked.includes(userId)) {
            Sauces.updateOne({ _id: sauceId }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
            .then(() => res.status(200).json({ message: 'Like enlevé !'}))
            .catch((error) => res.status(400).json({ error }));
          }
          if(sauce.usersDisliked.includes(userId)) {
            Sauces.updateOne({ _id: sauceId }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
            .then(() => res.status(200).json({ message: 'Dislike enlevé !'}))
            .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error: 'impossib' }));
      break;
    case -1:
      Sauces.updateOne({ _id: sauceId }, { $inc: { dislikes: +1 }, $push: { usersDisliked: req.body.userId } }) 
      .then(() => res.status(200).json({ message: 'Dislike ok !'}))
      .catch((error) => res.status(400).json({ error }));
      break;
    default:
      console.log(error)
  }

  // if(req.body.like === 1){
  //   Sauces.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: req.body.userId } }) 
  //   .then(() => res.status(200).json({ message: 'Like ok !'}))
  //   .catch(error => res.status(400).json({ error }));
  // } else if (req.body.like == -1) {
  //   Sauces.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $push: { usersDisliked: req.body.userId } }) 
  // .then(() => res.status(200).json({ message: 'Dislike ok !'}))
  //   .catch(error => res.status(400).json({ error }));
  // } else {
  //   Sauces.findOne({ _id: req.params.id}).then(
  //     (sauce) => {
  //     for(let i = 0; i < sauce.usersLiked.length; i++) {
  //       if(sauce.usersLiked[i] == req.body.userId) {
  //         Sauces.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
  //         .then(() => res.status(200).json({ message: 'Like enlevé !'}))
  //         .catch(error => res.status(400).json({ error }));
  //       }
  //     }
  //     for(let i = 0; i < sauce.usersDisliked.length; i++) {
  //       if(sauce.usersDisliked[i] == req.body.userId) {
  //         Sauces.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
  //         .then(() => res.status(200).json({ message: 'Dislike enlevé !'}))
  //         .catch(error => res.status(400).json({ error }));
  //       }
  //     }
    
  //   })
  //   .catch(error => res.status(400).json({ error }));
  // };
};
