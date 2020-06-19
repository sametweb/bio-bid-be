const subMapper = function(sub) {
  return { info: { connect: { name: sub.name } } };
};

const specMapper = function(spec) {
  return {
    info: { connect: { name: spec.name } },
    sub_specialties: {
      create: Array.isArray(spec.sub_specialties)
        ? spec.sub_specialties.map(subMapper)
        : [],
    },
  };
};

exports.servMapper = function(service) {
  return {
    info: { connect: { name: service.name } },
    specialties: {
      create: Array.isArray(service.specialties)
        ? service.specialties.map(specMapper)
        : [],
    },
  };
};
