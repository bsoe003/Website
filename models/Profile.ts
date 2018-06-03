type ProfileInput = {
  label: string;
  link: string;
};

class Profile {
  public static LINKEDIN = new Profile({
    label: 'linkedin',
    link: 'https://linkedin.com/in/bsoe003',
  });
  public static GITHUB = new Profile({
    label: 'github',
    link: 'https://github.com/bsoe003',
  });
  public static TWITTER = new Profile({
    label: 'twitter',
    link: 'https://twitter.com/bsoe003',
  });
  public static PINTEREST = new Profile({
    label: 'pinterest',
    link: 'https://www.pinterest.com/bsoe003/',
  });

  public readonly label: string;
  public readonly link: string;

  constructor({ label, link }: ProfileInput) {
    this.label = label;
    this.link = link;
  }
}

export default Profile;
