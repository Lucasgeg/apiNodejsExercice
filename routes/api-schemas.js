exports.userCreation = {
  /**
   * @swagger
   * components:
   *   schemas:
   *     userCreation:
   *       type: object
   *       required:
   *         - name
   *         - email
   *         - password
   *         - admin
   *       properties:
   *         name:
   *           type: string
   *           description: The name of the user
   *         email:
   *           type: string
   *           description: The email of the user
   *           pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"

   *         password:
   *           type: string
   *           description: The password of the user
   *           pattern: "^(?=.*[0-9]{3})(?=.*[!@#$%^&*]{2}).{13,}$"
   *         pseudo:
   *           type: string
   *           description: The pseudo name of the user
   *         admin:
   *           type: boolean
   *           description: Set if the user is an admin
   *       example:
   *           name: dilidoMaster,
   *           email: deusex29@gmail.com
   *           password: totor154%%remain
   *           admin: true

    * @swagger
    * tags:
    *   name: Auth
    *   description: The authentification managing API
    * /register:
    *   post:
    *     summary: Create a new user
    *     tags: [userCreation]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/userCreation'
    *     responses:
    *       200:
    *         description: The created book.
    *         content:
    *           application/json:
    *             {
    *                 "message": "Successfully added! You can now connect to your account"
    *             }
    *       500:
    *         description: Some server error
    *
    */
};
