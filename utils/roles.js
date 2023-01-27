const AccessControl = require("accesscontrol");

const ac = new AccessControl();

exports.roles = function () {
  ac.grant("tenant").readOwn("profile").updateOwn("profile");

  ac.grant("landlord").extend("tenant").readOwn("profile").updateOwn("profile");

  ac.grant("admin").extend("tenant").extend("landlord").readAny("profile");

  ac.grant("superadmin")
    .extend("tenant")
    .extend("landlord")
    .extend("admin")
    .updateAny("profile")
    .deleteAny("profile");

  return ac;
};
