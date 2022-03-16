const { body, validationResult } = require('express-validator');

const localFiberConnectionModel = require('../../model/localFiberConnectionModel.js');
const resellerConnectionModel = require('../../model/resellerConnectionModel.js');

exports.createLocalFiberConnectionValidation = [
  body('name').notEmpty().withMessage('name is required'),
  body('parent').notEmpty().withMessage('parent is required'),
  body('parentType').notEmpty().withMessage('parentType is required'),
  body('totalCore').notEmpty().withMessage('totalCore is required'),
  body('coordinates').notEmpty().withMessage('coordinates is required'),
];

exports.createLocalFiberConnection = async (req, res) => {
  try {
    // validating the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, parent, parentType, totalCore, coordinates } = req.body;

    let selectedParent = null;
    if (parentType === 'reseller') {
      selectedParent = await resellerConnectionModel.findOne({ _id: parent });
    } else if (parentType === 'localFiber') {
      selectedParent = await localFiberConnectionModel.findOne({ _id: parent });
    }

    if (!selectedParent) {
      return res.status(400).json({
        status: 'error',
        message: 'parent connection does not exist',
      });
    }

    const coordinatesLatLngArr = coordinates.map((item) => {
      return [item.lat, item.lng];
    });

    if (selectedParent.type === 'reseller') {
      const createLocalFiberConnection = await localFiberConnectionModel.create(
        {
          name,
          parent: selectedParent._id,
          parentType: 'reseller',
          totalCore,
          type: 'localFiber',
          totalCore,
          locations: [
            {
              coordinates: coordinatesLatLngArr,
            },
          ],
        }
      );

      selectedParent.childrens.push({
        child: createLocalFiberConnection._id,
        connectionType: 'localFiber',
      });

      await selectedParent.save();

      return res.status(201).json({
        status: 'success',
        data: createLocalFiberConnection,
      });
    } else if (selectedParent.type === 'localFiber') {
      const markerPoint = selectedParent.markers.find((item) => {
        return item.coordinates[0] === coordinatesLatLngArr[0][0];
      });
      if (!markerPoint) {
        selectedParent.markers.push({
          coordinates: coordinatesLatLngArr[0],
        });
      } else {
        markerPoint.totalConnected++;
      }
      selectedParent.locations.push({
        coordinates: coordinatesLatLngArr,
      });

      await selectedParent.save();

      return res.status(201).json({
        status: 'success',
        data: selectedParent,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
};